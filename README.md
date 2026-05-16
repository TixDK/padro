# Padro

A direct line between Denmark's padel players and their coach. Fair price. Fair pay.

Padro is a marketplace that connects players with padel coaches across Denmark — we don't own courts, we don't take agency cuts, we just match the right coach with the right player.

## Stack

- **React 19** + **Vite 8** — fast dev, fast builds
- **Tailwind CSS v4** (via `@tailwindcss/vite`) with a custom `@theme` design system
- **Framer Motion 12** — scroll-triggered reveals, staggered children, layout animations, scroll-linked parallax
- **React Router 7** — routes for `/`, `/login`, `/account`
- **@react-oauth/google** — Google Identity Services for sign-in

## Getting started

```bash
npm install
cp .env.example .env.local       # add your Google OAuth Client ID
npm run dev
```

Then open `http://localhost:5173`.

### Google OAuth

`VITE_GOOGLE_CLIENT_ID` is required for the sign-in flow.

1. Create an OAuth Client ID at <https://console.cloud.google.com/apis/credentials> (type: **Web application**).
2. Add `http://localhost:5173` (and your production origin) to **Authorized JavaScript origins**.
3. Paste the ID into `.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
   ```
4. Restart `npm run dev`.

Until the env var is set, the `/login` page renders a disabled state with an inline notice.

## Scripts

| Script           | Purpose                          |
|------------------|----------------------------------|
| `npm run dev`    | Vite dev server with HMR         |
| `npm run build`  | Production build to `dist/`      |
| `npm run preview`| Preview the production build     |
| `npm run lint`   | Run ESLint                       |

## Project structure

```
src/
  App.jsx               # Route definitions + auth guards
  main.jsx              # Providers (Router, GoogleOAuth, Auth)
  index.css             # Tailwind v4 @theme tokens
  auth/
    AuthContext.jsx     # Auth state + localStorage persistence
    GoogleButton.jsx    # Custom-styled Google sign-in button
    useRateLimit.js     # Sliding-window client-side rate limiter
  components/
    Hero.jsx, ValueProps.jsx, ForCoaches.jsx,
    DownloadApp.jsx, Pricing.jsx, FinalCTA.jsx,
    Navbar.jsx, Footer.jsx, Layout.jsx,
    ScrollProgress.jsx, Icon.jsx, motion-primitives.jsx
  pages/
    Home.jsx            # Landing composition
    Login.jsx           # Standalone Google sign-in page
    Account.jsx         # Post-login profile view
```

## Design system

The theme lives in `src/index.css` under `@theme`:

- Surface `#fbf9f4` (cream)
- Primary `#001f11` (deep green)
- Primary container `#0a3622`
- Secondary container `#fe932c` (orange)
- Fonts: **Fraunces** (display/serif), **Inter** (body), **Literata** (alt display)

Status: launching in Denmark first.
