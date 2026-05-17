# Prompt: Build the Padro post-login dashboard

Copy-paste the section below into a fresh Claude Code session running in the
`padro` project root. **Do not run this in the same session as the onboarding
prompt** — keep them separate so context stays focused. This prompt assumes the
onboarding questionnaire is already merged. If it isn't, run that one first.

---

You are working inside the `padro` repo at `C:\Users\marvi\Desktop\Kodning\React\padro`.

## Project tour (read these first, do NOT skip)

- Stack: React 19, Vite 8 (port 3000 pinned), Tailwind v4 (`@tailwindcss/vite`), Framer Motion 12, React Router 7, Supabase JS v2.
- Brand DNA lives in: `src/pages/Home.jsx`, `src/components/Hero.jsx`, `src/components/ValueProps.jsx`, `src/components/ForCoaches.jsx`, `src/components/Pricing.jsx`, `src/components/FinalCTA.jsx`, `src/components/Layout.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`. Read all of them before writing a line. Internalise the rhythm — long serif headlines, italic accent words, hairline borders, uppercase labels with `tracking-[0.32em]`, soft 0.16/1/0.3/1 easings, staggered enters, scroll-linked parallax.
- Motion helpers: `src/components/motion-primitives.jsx` and `src/components/ScrollProgress.jsx`. Use them — don't reinvent.
- Auth: `src/auth/AuthContext.jsx` exposes `{ user, profile, isAuthenticated, loading, signIn, signOut }` (the onboarding prompt extends it to include `profile`).
- Supabase client: `src/lib/supabaseClient.js`.
- DB: `profiles`, `trainers`, `player_ratings`, `venues`, `trainer_venues`, `sessions`, `bookings`, `reviews`, `audit_log`. RLS everywhere — anything you read must respect `auth.uid()`.
- Existing `/account` is a placeholder page (`src/pages/Account.jsx`). You'll either replace it or repurpose it.

## What to build

A logged-in dashboard at `/dashboard` (move `/account` to redirect there for backwards compat) that:

- Adapts to role: player view vs coach view, driven by `profile.role`.
- Carries the landing page's visual language directly into the product. A user clicking "Sign in" on the marketing site should feel zero design discontinuity.
- Has its own layout (sidebar nav + sticky topbar) — distinct from the marketing `<Layout>`. Don't reuse `<Layout>` because the marketing nav doesn't belong inside the app.
- Is mobile-first. Sidebar collapses to a bottom tab bar on small screens.

### Information architecture

**Sidebar (left, sticky):**
- Padro wordmark/logo at top — links to `/dashboard`.
- Sections (icons via Material Symbols Outlined, which is already loaded via the Login page):
  - Overview (`dashboard`)
  - Sessions — coach: my upcoming sessions. Player: sessions I'm booked into.
  - Find a coach (player) / My students (coach)
  - Profile (`person`)
  - Settings (`settings`)
- At bottom: avatar + name + role badge, click opens menu with "Sign out" and "Switch role" (only if the user has both player + coach completed — defer if too complex, just show sign out).

**Topbar (sticky):**
- Page title on the left.
- Right: search field (placeholder for now, no functionality), notification bell (placeholder), avatar dropdown.

### Overview page sections

**Player Overview**
1. Welcome hero — "Velkommen tilbage, {givenName}" in serif clamp(2rem, 5vw, 3.5rem), with italic accent on the name (mirror the `Account.jsx` treatment).
2. **Next session** card (full-width, prominent) — shows next confirmed booking with countdown, venue, coach name + avatar, "View details" CTA. Empty state: "No sessions yet — find a coach to get started." with CTA to find-a-coach page.
3. **Stats strip** — 3 small cards: sessions completed, average rating you give, level (from `player_ratings`).
4. **Recommended coaches** — horizontal scroll of approved trainer cards (read from `public.trainers` joined with `profiles` for name + avatar). 4–6 cards. Each card: avatar, name, headline, rating + count, "View" CTA. Use stagger animation on mount.
5. **Recent activity** — last 5 bookings (mix of upcoming + past) as a timeline list.

**Coach Overview**
1. Welcome hero — same treatment.
2. **Approval status banner** — if `trainers.approved_at` is null, show a soft warning card "Profile under review · We'll email when you're live." Don't let pending coaches create sessions yet (disable the CTA).
3. **Earnings strip** — placeholder cards (this month, last month, all time). Use realistic-looking 0-state copy.
4. **Today's schedule** — list of sessions starting today, with player names + session details.
5. **Upcoming sessions** — next 5 sessions you're coaching, with bookings count vs capacity (e.g. "3/4 booked").
6. **Recent reviews** — last 3 reviews, with rating + comment.
7. **CTA card** — "Create new session" → goes to /sessions/new (out of scope — placeholder route fine).

### Motion details (non-negotiable)

- Page enter: use the same stagger pattern as `Home.jsx`. Each major card group fades in with `y: 24 → 0` over 0.9s with `[0.16, 1, 0.3, 1]` easing, 0.08–0.12s stagger between cards.
- Sidebar items: spring hover (`whileHover: { x: 2 }`) with stiffness 380, damping 26 — mirror the soft-hover used in Login's GoogleButton.
- ScrollProgress bar at top — reuse the existing component.
- Avatar dropdown: motion-spring scale-in from origin top-right.
- Respect `useReducedMotion()` everywhere.

### Data hooks to create (under `src/lib/`)

```
useProfile()              -> { profile, loading, refetch }   (already exists from onboarding prompt if it ran)
useTrainers({ approved })  -> { data, loading, error }
useMyBookings()           -> player: own bookings; coach: bookings of own sessions
useMySessions()           -> coach: own sessions
useRecommendedTrainers()  -> 4-6 trainers, sorted by rating_avg desc, filtered by city if available
```

Each hook should subscribe to Supabase realtime where it makes sense (e.g. `useMyBookings` listens for new INSERTs on bookings filtered by `player_id eq auth.uid()`).

### Visual tokens (do NOT invent new ones)

- Background: `bg-surface` (light) — the dashboard lives in the marketing-day mode, not the dark hero treatment from `Account.jsx`'s current placeholder.
- Card surface: white with `border-hairline` + `shadow-[0_18px_50px_-30px_rgba(0,31,17,0.10)]`.
- Accent: `text-primary` for serif headings, `text-secondary-container` for italic accents.
- Hairlines: 1px, color `hairline` token.
- Type scale: heading `font-serif`, body `text-on-surface-variant`, labels uppercase tracking-[0.22em] in `font-sans`.

### Routing changes

```
/dashboard                  — DashboardLayout > Overview
/dashboard/sessions         — DashboardLayout > Sessions list (placeholder content)
/dashboard/find             — player only — placeholder
/dashboard/students         — coach only — placeholder
/dashboard/profile          — DashboardLayout > Profile editor (placeholder)
/dashboard/settings         — DashboardLayout > Settings (placeholder)
/account                    — redirects to /dashboard
```

`<RequireAuth>` + `<RequireOnboarded>` guards wrap the whole `/dashboard/*` tree.

### Files you'll touch

```
src/pages/dashboard/DashboardLayout.jsx       (NEW)
src/pages/dashboard/Sidebar.jsx               (NEW)
src/pages/dashboard/Topbar.jsx                (NEW)
src/pages/dashboard/MobileTabBar.jsx          (NEW)
src/pages/dashboard/Overview.jsx              (NEW — role-aware)
src/pages/dashboard/PlayerOverview.jsx        (NEW)
src/pages/dashboard/CoachOverview.jsx         (NEW)
src/pages/dashboard/SessionsPage.jsx          (NEW)
src/pages/dashboard/FindCoachPage.jsx         (NEW)
src/pages/dashboard/StudentsPage.jsx          (NEW)
src/pages/dashboard/ProfilePage.jsx           (NEW)
src/pages/dashboard/SettingsPage.jsx          (NEW)
src/pages/dashboard/cards/NextSessionCard.jsx (NEW)
src/pages/dashboard/cards/StatStrip.jsx       (NEW)
src/pages/dashboard/cards/TrainerCard.jsx     (NEW)
src/pages/dashboard/cards/ActivityList.jsx    (NEW)
src/lib/hooks/useTrainers.js                  (NEW)
src/lib/hooks/useMyBookings.js                (NEW)
src/lib/hooks/useMySessions.js                (NEW)
src/lib/hooks/useRecommendedTrainers.js       (NEW)
src/App.jsx                                    (add /dashboard/* routes, redirect /account)
```

Do NOT touch `src/pages/Home.jsx`, `src/pages/Login.jsx`, `src/pages/Onboarding.jsx`, or any file in `src/components/` other than reading them for style reference.

### Acceptance criteria (verify before finishing)

- [ ] `npm run lint` passes.
- [ ] `npm run build` succeeds.
- [ ] Visiting `/dashboard` as a player shows PlayerOverview.
- [ ] Visiting `/dashboard` as a coach shows CoachOverview.
- [ ] Pending coach (`approved_at is null`) sees the approval banner and cannot click "Create session".
- [ ] All cards have empty states (don't crash on missing data).
- [ ] Sidebar collapses to a bottom tab bar at `md:` breakpoint.
- [ ] No layout shift on data load — use skeleton placeholders.
- [ ] `useReducedMotion()` respected — no aggressive animations for users with the OS preference set.
- [ ] All Supabase queries have an error path that surfaces to the UI (don't swallow errors).
- [ ] Marketing landing page (`/`) and dashboard (`/dashboard`) share the same brand identity at a glance — same fonts, same hairlines, same color tokens, same easing curves.

### Design references inside this repo

Before you write JSX, open these and screenshot-the-soul of them in your head:
- `src/components/Hero.jsx` — typographic scale + italic accent rhythm.
- `src/pages/Login.jsx` — card surface + button language.
- `src/components/ValueProps.jsx` — card grid + uppercase labels.
- `src/components/Pricing.jsx` — table-meets-card layout, useful for sessions list.
- `src/pages/Account.jsx` (the current dark placeholder) — gives you a sense of which gestures fail (the dark gradient does NOT belong in the dashboard — leave the dark hero language for marketing).

When you're done, write a short summary in chat telling me:
- Which files you created/changed
- Any design decisions you made that weren't in this brief
- A list of placeholder routes that still need real content (so I can pick the next prompt)
