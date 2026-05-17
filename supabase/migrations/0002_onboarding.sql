-- =============================================================================
-- 0002 — Onboarding state, player rating profile, preferred venues
-- =============================================================================
-- Adds first-login questionnaire support:
--   * profiles.onboarded_at      — null until the user finishes the wizard.
--   * profiles.preferred_venue_ids — player-side multi-select.
--   * player_ratings              — per-player level/rating enrichment.
--
-- Existing rows keep onboarded_at = null, so every current account is sent
-- through the questionnaire on next sign-in.
-- =============================================================================

begin;

-- ---- profiles columns ------------------------------------------------------
alter table public.profiles
  add column if not exists onboarded_at timestamptz;

alter table public.profiles
  add column if not exists preferred_venue_ids uuid[] not null default '{}';

-- ---- player_ratings --------------------------------------------------------
create table if not exists public.player_ratings (
  profile_id        uuid primary key references public.profiles(id) on delete cascade,
  rankedin_rating   numeric(4,2) check (rankedin_rating is null or rankedin_rating between 0 and 8),
  playtomic_level   numeric(3,2) check (playtomic_level is null or playtomic_level between 0 and 7),
  padellink_rating  numeric(4,2) check (padellink_rating is null or padellink_rating between 0 and 8),
  play_frequency    text check (play_frequency in ('rarely','monthly','weekly','multiple_per_week','daily')),
  years_playing     integer check (years_playing is null or years_playing between 0 and 60),
  dominant_hand     text check (dominant_hand in ('right','left','ambidextrous')),
  preferred_side    text check (preferred_side in ('left','right','either')),
  updated_at        timestamptz not null default now()
);

alter table public.player_ratings enable row level security;

drop trigger if exists player_ratings_updated_at on public.player_ratings;
create trigger player_ratings_updated_at
  before update on public.player_ratings
  for each row execute function public.set_updated_at();

drop policy if exists "player_ratings: owner reads"   on public.player_ratings;
drop policy if exists "player_ratings: owner upserts" on public.player_ratings;

create policy "player_ratings: owner reads"
  on public.player_ratings for select using (auth.uid() = profile_id);

create policy "player_ratings: owner upserts"
  on public.player_ratings for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

commit;
