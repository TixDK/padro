-- =============================================================================
-- PADRO — Initial schema
-- =============================================================================
-- Marketplace connecting padel coaches with players in Denmark.
-- Players book courts themselves (external — PadelPadel, MatchPadel, Bookli).
-- Padro handles coaching booking, payment, ratings.
--
-- Security model:
--   * RLS enabled on every table — no exceptions.
--   * All client access goes through auth.uid() — anonymous reads only where
--     explicitly safe (public trainer listings, venue catalog, reviews).
--   * Service-role-only tables (audit_log) have no INSERT/UPDATE policy at all
--     so the browser bundle cannot tamper with them.
--   * CHECK constraints and triggers enforce data integrity even if the app
--     layer is bypassed.
--   * Rate limiting on bookings is enforced server-side via a trigger that
--     blocks > 10 bookings/hour per player (spam/abuse guard).
-- =============================================================================

begin;

-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================
create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- =============================================================================
-- 2. ENUMS
-- =============================================================================

create type public.user_role     as enum ('player','trainer','admin');
create type public.skill_level   as enum ('beginner','intermediate','advanced','pro');
create type public.session_status as enum ('open','full','completed','cancelled');
create type public.booking_status as enum (
  'confirmed','cancelled_by_player','cancelled_by_trainer','no_show'
);
create type public.payment_status as enum ('pending','succeeded','refunded','failed');

-- =============================================================================
-- 3. HELPER FUNCTIONS
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 4. PROFILES — extends auth.users
-- =============================================================================

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  role            public.user_role not null default 'player',
  display_name    text not null check (char_length(display_name) between 1 and 80),
  avatar_url      text,
  bio             text check (char_length(bio) <= 1000),
  city            text check (char_length(city) <= 80),
  level           public.skill_level,
  phone           text check (phone is null or phone ~ '^\+?[0-9\s\-]{6,20}$'),
  locale          text default 'da-DK',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile when a new auth.users row appears (Google sign-up)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email,'user'), '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    'player'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 5. VENUES — read-only catalog of Danish padel facilities
-- =============================================================================

create table public.venues (
  id                uuid primary key default gen_random_uuid(),
  name              text not null unique check (char_length(name) between 2 and 120),
  slug              text not null unique check (slug ~ '^[a-z0-9-]+$'),
  city              text not null,
  address           text,
  booking_provider  text check (booking_provider in ('bookli','matchpadel','padelpadel','playtomic','other')),
  booking_url       text,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

create index venues_city_idx on public.venues(city) where active;

-- =============================================================================
-- 6. TRAINERS — coach-specific data
-- =============================================================================

create table public.trainers (
  id                uuid primary key references public.profiles(id) on delete cascade,
  headline          text not null check (char_length(headline) between 5 and 120),
  hourly_rate_dkk   integer not null check (hourly_rate_dkk between 100 and 5000),
  languages         text[] not null default '{da}',
  specialties       text[] not null default '{}',
  experience_years  integer check (experience_years between 0 and 60),
  rating_avg        numeric(3,2) check (rating_avg is null or rating_avg between 0 and 5),
  rating_count      integer not null default 0 check (rating_count >= 0),
  stripe_account_id text,
  approved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger trainers_updated_at
  before update on public.trainers
  for each row execute function public.set_updated_at();

create index trainers_approved_idx on public.trainers(rating_avg desc nulls last)
  where approved_at is not null;

-- Trainers ↔ venues many-to-many
create table public.trainer_venues (
  trainer_id  uuid not null references public.trainers(id) on delete cascade,
  venue_id    uuid not null references public.venues(id) on delete restrict,
  primary key (trainer_id, venue_id)
);

create index trainer_venues_venue_idx on public.trainer_venues(venue_id);

-- =============================================================================
-- 7. SESSIONS — coach-created bookable slots
-- =============================================================================

create table public.sessions (
  id                    uuid primary key default gen_random_uuid(),
  trainer_id            uuid not null references public.trainers(id) on delete restrict,
  venue_id              uuid not null references public.venues(id) on delete restrict,
  starts_at             timestamptz not null,
  ends_at               timestamptz not null,
  capacity              integer not null check (capacity between 1 and 4),
  price_per_player_dkk  integer not null check (price_per_player_dkk between 50 and 5000),
  level                 public.skill_level,
  notes                 text check (char_length(notes) <= 500),
  status                public.session_status not null default 'open',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  check (ends_at > starts_at),
  check (ends_at - starts_at <= interval '4 hours'),
  check (starts_at > created_at)
);

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

create index sessions_search_idx on public.sessions(starts_at, venue_id)
  where status in ('open','full');

create index sessions_trainer_idx on public.sessions(trainer_id, starts_at desc);

-- =============================================================================
-- 8. BOOKINGS — a player joining a session
-- =============================================================================

create table public.bookings (
  id                          uuid primary key default gen_random_uuid(),
  session_id                  uuid not null references public.sessions(id) on delete restrict,
  player_id                   uuid not null references public.profiles(id) on delete restrict,
  status                      public.booking_status not null default 'confirmed',
  payment_status              public.payment_status not null default 'pending',
  stripe_payment_intent_id    text unique,
  amount_paid_dkk             integer check (amount_paid_dkk is null or amount_paid_dkk >= 0),
  cancellation_deadline       timestamptz not null,
  cancelled_at                timestamptz,
  cancellation_reason         text check (char_length(cancellation_reason) <= 200),
  created_at                  timestamptz not null default now(),
  unique (session_id, player_id)
);

create index bookings_player_idx  on public.bookings(player_id, created_at desc);
create index bookings_session_idx on public.bookings(session_id) where status = 'confirmed';

-- Server-side rate limit: stop the same player from spamming bookings.
create or replace function public.bookings_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.bookings
  where player_id = new.player_id
    and created_at > now() - interval '1 hour';

  if recent_count >= 10 then
    raise exception 'Booking rate limit: max 10 bookings per hour per player'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger bookings_rate_limit_trigger
  before insert on public.bookings
  for each row execute function public.bookings_rate_limit();

-- =============================================================================
-- 9. REVIEWS — player rates trainer after session
-- =============================================================================

create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references public.bookings(id) on delete cascade,
  trainer_id  uuid not null references public.trainers(id) on delete cascade,
  player_id   uuid not null references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text check (char_length(comment) <= 1000),
  created_at  timestamptz not null default now()
);

create index reviews_trainer_idx on public.reviews(trainer_id, created_at desc);

-- Keep trainer aggregate ratings up to date.
create or replace function public.refresh_trainer_rating()
returns trigger
language plpgsql
as $$
begin
  update public.trainers t
  set rating_avg = sub.avg, rating_count = sub.cnt, updated_at = now()
  from (
    select trainer_id, round(avg(rating)::numeric, 2) as avg, count(*) as cnt
    from public.reviews
    where trainer_id = coalesce(new.trainer_id, old.trainer_id)
    group by trainer_id
  ) sub
  where t.id = sub.trainer_id;
  return coalesce(new, old);
end;
$$;

create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_trainer_rating();

-- =============================================================================
-- 10. AUDIT_LOG — append-only security events
-- =============================================================================
-- No client INSERT/UPDATE/DELETE policy — only the service role (Edge Functions)
-- can write here. Useful for spotting abuse, brute-force, mass-booking.

create table public.audit_log (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  action      text not null,
  metadata    jsonb,
  ip          inet,
  created_at  timestamptz not null default now()
);

create index audit_user_idx   on public.audit_log(user_id, created_at desc);
create index audit_action_idx on public.audit_log(action, created_at desc);

-- =============================================================================
-- 11. ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles       enable row level security;
alter table public.venues         enable row level security;
alter table public.trainers       enable row level security;
alter table public.trainer_venues enable row level security;
alter table public.sessions       enable row level security;
alter table public.bookings       enable row level security;
alter table public.reviews        enable row level security;
alter table public.audit_log      enable row level security;

-- PROFILES
create policy "profiles: read public"
  on public.profiles for select using (true);

create policy "profiles: insert own"
  on public.profiles for insert with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- VENUES (read-only for users)
create policy "venues: read active"
  on public.venues for select using (active = true);

-- TRAINERS
create policy "trainers: read approved or self"
  on public.trainers for select using (approved_at is not null or auth.uid() = id);

create policy "trainers: insert own"
  on public.trainers for insert with check (auth.uid() = id);

create policy "trainers: update own"
  on public.trainers for update using (auth.uid() = id) with check (auth.uid() = id);

-- TRAINER_VENUES
create policy "trainer_venues: read all"
  on public.trainer_venues for select using (true);

create policy "trainer_venues: manage own"
  on public.trainer_venues for all using (auth.uid() = trainer_id) with check (auth.uid() = trainer_id);

-- SESSIONS
create policy "sessions: read public"
  on public.sessions for select
  using (status in ('open','full','completed') or auth.uid() = trainer_id);

create policy "sessions: trainer creates own"
  on public.sessions for insert with check (auth.uid() = trainer_id);

create policy "sessions: trainer updates own"
  on public.sessions for update using (auth.uid() = trainer_id) with check (auth.uid() = trainer_id);

create policy "sessions: trainer deletes own"
  on public.sessions for delete using (auth.uid() = trainer_id);

-- BOOKINGS
create policy "bookings: player reads own"
  on public.bookings for select using (auth.uid() = player_id);

create policy "bookings: trainer reads own session's"
  on public.bookings for select using (
    exists (select 1 from public.sessions s
            where s.id = bookings.session_id and s.trainer_id = auth.uid())
  );

create policy "bookings: player creates own"
  on public.bookings for insert with check (auth.uid() = player_id);

create policy "bookings: player updates own"
  on public.bookings for update using (auth.uid() = player_id) with check (auth.uid() = player_id);

create policy "bookings: trainer updates own session's"
  on public.bookings for update using (
    exists (select 1 from public.sessions s
            where s.id = bookings.session_id and s.trainer_id = auth.uid())
  );

-- REVIEWS
create policy "reviews: read all"
  on public.reviews for select using (true);

create policy "reviews: player creates from confirmed booking"
  on public.reviews for insert with check (
    auth.uid() = player_id
    and exists (
      select 1 from public.bookings b
      where b.id = reviews.booking_id
        and b.player_id = auth.uid()
        and b.status = 'confirmed'
    )
  );

create policy "reviews: player updates own"
  on public.reviews for update using (auth.uid() = player_id) with check (auth.uid() = player_id);

-- AUDIT_LOG — read own, no write policy (service role only)
create policy "audit_log: user reads own"
  on public.audit_log for select using (auth.uid() = user_id);

-- =============================================================================
-- 12. SEED DATA — common Danish padel venues
-- =============================================================================

insert into public.venues (name, slug, city, booking_provider, booking_url) values
  ('PadelPadel Vesterbro',  'padelpadel-vesterbro',  'København',     'padelpadel', 'https://padelpadel.dk/'),
  ('PadelPadel Amager',     'padelpadel-amager',     'København',     'padelpadel', 'https://padelpadel.dk/'),
  ('MatchPadel Nordhavn',   'matchpadel-nordhavn',   'København',     'matchpadel', 'https://matchpadel.dk/'),
  ('Bookli Frederiksberg',  'bookli-frederiksberg',  'Frederiksberg', 'bookli',     'https://bookli.dk/'),
  ('Padel Tower Aarhus',    'padel-tower-aarhus',    'Aarhus',        'bookli',     'https://bookli.dk/'),
  ('PadelXperience Odense', 'padelxperience-odense', 'Odense',        'bookli',     'https://bookli.dk/')
on conflict (slug) do nothing;

commit;
