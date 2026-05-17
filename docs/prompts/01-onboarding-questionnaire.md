# Prompt: Build the Padro first-login onboarding questionnaire

Copy-paste the section below into a fresh Claude Code session running in the
`padro` project root. It contains all the context Claude needs — don't strip the
project tour or it'll guess wrong about the stack.

---

You are working inside the `padro` repo at `C:\Users\marvi\Desktop\Kodning\React\padro`.

## Project tour (read these first, do NOT skip)

- Stack: React 19, Vite 8 (port 3000 pinned), Tailwind v4 (via `@tailwindcss/vite`), Framer Motion 12, React Router 7, Supabase JS v2 (PKCE flow).
- Auth context: `src/auth/AuthContext.jsx`. It exposes `{ user, isAuthenticated, loading, signIn, signOut }`. The `user` object is mapped from Supabase to: `{ id, email, name, givenName, familyName, picture, emailVerified, locale, provider, signedInAt }`.
- Supabase client: `src/lib/supabaseClient.js` — already configured with env vars from `.env.local`.
- Routing: `src/App.jsx`. Routes today are `/`, `/login`, `/account`. `<RequireAuth>` and `<RedirectIfAuthed>` guards are already loading-aware.
- Existing visual language: read `src/components/Hero.jsx`, `src/components/ValueProps.jsx`, `src/pages/Login.jsx`, and `src/pages/Account.jsx` before writing a single line. Match: serif display headings (`font-serif`), `[clamp]` font sizing, soft motion springs, hairline borders, `bg-surface`/`bg-primary`/`bg-primary-container` color tokens, label microcopy in uppercase tracked at `0.32em`.
- Motion utilities: there is a `src/components/motion-primitives.jsx`. Use what's there before inventing new wrappers.
- Database schema (already deployed): `profiles`, `trainers`, `players (via profiles.role)`, `venues`, `trainer_venues`, `sessions`, `bookings`, `reviews`, `audit_log`. Migration file: `supabase/migrations/0001_initial_schema.sql`. RLS is on everywhere; rely on auth.uid() — no service role calls from the browser.

## What to build

A multi-step onboarding questionnaire shown on a user's FIRST login. After Google sign-in lands them on the app, we need to capture role + profile data before they can use the dashboard.

### Required database change

Add a new migration `supabase/migrations/0002_onboarding.sql` that:

1. Adds a column `onboarded_at timestamptz` to `public.profiles` (nullable).
2. Adds a new table `public.player_ratings`:

   ```sql
   create table public.player_ratings (
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
   create policy "player_ratings: owner reads"
     on public.player_ratings for select using (auth.uid() = profile_id);
   create policy "player_ratings: owner upserts"
     on public.player_ratings for all
     using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
   ```

3. Backfills nothing — existing rows stay with `onboarded_at = null` so they hit the questionnaire on next login.

Tell me to paste it in the Supabase SQL editor at the end — don't try to run it yourself.

### The flow

1. After login, `AuthContext` should expose `profile` (from `public.profiles`) AND `loading` until both auth + profile are resolved.
2. Add a route `/onboarding`.
3. New guard `<RequireOnboarded>` wrapping `/account` (and any future protected route): if `profile.onboarded_at` is null, `<Navigate to="/onboarding" replace />`.
4. New guard `<RedirectIfOnboarded>` wrapping `/onboarding`: if already onboarded, send to `/account`.
5. After the final step submits, set `profiles.onboarded_at = now()` and navigate to `/account`.

### The form steps

Use a step counter at the top (e.g. "Step 2 of 4 · Your level") with a thin gold progress bar.

**Step 1 — Role**
- Two big tappable cards: "I'm a player" / "I'm a coach". 
- Updates `profiles.role`.
- On select, transition forward.

**Step 2 — Identity (both roles)**
- `display_name` (prefilled from Google), `city`, `phone` (optional).
- Skip-able phone.

**Step 3 — Player branch** (skipped for coaches)
- Rating inputs — three optional number fields with helper text:
  - Rankedin rating (0.00–8.00)
  - Playtomic level (0.00–7.00)
  - Padel Link rating (0.00–8.00)
  - Microcopy: "Got at least one. We use them to match you with the right level."
- Self-assessed `level` (radio: beginner / intermediate / advanced / pro) — required.
- `play_frequency` (radio: rarely / monthly / weekly / multiple_per_week / daily) — required.
- `years_playing` (number, 0–60) — required.
- `dominant_hand` (right / left / ambidextrous) — required.
- `preferred_side` (left / right / either) — required.

**Step 3 — Coach branch** (skipped for players)
- `headline` (required, 5–120 chars, placeholder: "Padel-træner med 8 års turneringserfaring").
- `hourly_rate_dkk` (required, 100–5000, slider OR number input).
- `experience_years` (0–60).
- `languages` (multi-select chips: da, en, es, sv, no, de — default ["da"]).
- `specialties` (multi-select chips: smash, defense, kamp-forberedelse, begynder, viderekomne, fysisk-træning — free-form fine too).
- `bio` (textarea, max 1000 chars).

**Step 4 — Venues**
- Multi-select chips from `public.venues` (read via supabase). Shown to BOTH roles (players get "preferred venues", coaches get "venues I coach at"). For coaches, inserts into `trainer_venues`. For players, stored in a new column `profiles.preferred_venue_ids uuid[]` — add this column in the migration.

**Final**
- Summary screen showing what was captured + a confirm button. On confirm:
  1. `update profiles set onboarded_at = now()` + the captured fields.
  2. If coach, `insert into trainers (id, headline, hourly_rate_dkk, languages, specialties, experience_years)` — note `approved_at` stays null, so coach is hidden until admin approves.
  3. If player, `insert into player_ratings (...)`.
  4. Insert `trainer_venues` or update `profiles.preferred_venue_ids`.
  5. Navigate to `/account`.

### Visual/UX requirements (non-negotiable)

- Match `src/pages/Login.jsx`'s card aesthetic: white card on `bg-surface`, soft shadow `[0_18px_50px_-30px_rgba(0,31,17,0.18)]`, hairline borders, serif headings.
- Step transitions use Framer Motion with the same easing as Login (`[0.16, 1, 0.3, 1]`, ~0.6s).
- All chips/radios should have the soft-hover spring from `Login.jsx` (`whileHover: { y: -1 }`).
- Use `useReducedMotion()` and respect it everywhere.
- Mobile-first. Step indicator stays sticky at top on small screens.
- Don't introduce a UI library (no Radix, no shadcn). Tailwind classes + Framer Motion only.

### Acceptance criteria (verify before finishing)

- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds.
- [ ] First-time user: Google sign-in → `/onboarding` automatically.
- [ ] Refreshing the page mid-onboarding preserves their step + answers (use `sessionStorage`).
- [ ] Back button on a step takes you to the previous step, not out of the app.
- [ ] Submitting writes to all the right tables and sets `onboarded_at`.
- [ ] After completion, manually visiting `/onboarding` redirects to `/account` (already onboarded).
- [ ] Direct visit to `/account` without onboarding redirects to `/onboarding`.
- [ ] All Supabase calls have proper error handling — show a toast/inline error on failure, never silent.
- [ ] No `console.log` left in the committed code.

### Files you'll likely touch

```
supabase/migrations/0002_onboarding.sql          (NEW)
src/auth/AuthContext.jsx                          (extend to expose profile)
src/lib/profile.js                                (NEW — fetch + update profile helpers)
src/lib/venues.js                                 (NEW — fetch venues helper)
src/pages/Onboarding.jsx                          (NEW)
src/pages/onboarding/StepRole.jsx                 (NEW)
src/pages/onboarding/StepIdentity.jsx             (NEW)
src/pages/onboarding/StepPlayerDetails.jsx        (NEW)
src/pages/onboarding/StepCoachDetails.jsx        (NEW)
src/pages/onboarding/StepVenues.jsx               (NEW)
src/pages/onboarding/StepSummary.jsx              (NEW)
src/pages/onboarding/ProgressBar.jsx              (NEW)
src/App.jsx                                        (add /onboarding + guards)
```

Don't touch `src/pages/Home.jsx`, `src/pages/Login.jsx`, or anything in `src/components/` other than reading them for style reference.

When you're done, write a short summary in the chat telling me:
- Which files you created/changed
- The exact SQL to paste into Supabase
- Any decision you made that wasn't covered by this brief
