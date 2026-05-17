import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { useRateLimit } from '../auth/useRateLimit'
import { GoogleButton } from '../auth/GoogleButton'
import padroLogo from '../assets/padro.png'

const HAS_SUPABASE_ENV = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

export function Login() {
  const reduce = useReducedMotion()
  const location = useLocation()
  const { signIn } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const rl = useRateLimit({
    max: 5,
    windowMs: 60_000,
    cooldownMs: 90_000,
    storageKey: 'padro:rl:login',
  })

  // Preserve the original destination if the user was bounced by RequireAuth.
  const intended = location.state?.from?.pathname || '/account'
  const redirectTo = `${window.location.origin}${intended}`

  const handleSignIn = useCallback(async () => {
    setError(null)
    const { allowed, remainingMs } = rl.attempt()
    if (!allowed) {
      setError(
        `Too many attempts. Try again in ${Math.ceil(remainingMs / 1000)}s.`,
      )
      return
    }

    setLoading(true)
    const { error: err } = await signIn({ redirectTo })
    if (err) {
      // Most errors here mean Supabase couldn't kick off the redirect at all
      // (misconfigured provider, network). The actual Google round-trip is
      // out of our hands once the redirect fires.
      setLoading(false)
      setError(
        err.message ||
          'Sign in didn’t go through. Try again in a moment.',
      )
    }
    // On success the browser is already navigating to Google — no cleanup
    // needed; we come back via detectSessionInUrl after the round-trip.
  }, [signIn, redirectTo, rl])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10 text-on-surface sm:py-16">
      {/* Subtle, contained atmosphere — no full-bleed drama */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(254,147,44,0.06),transparent_70%)]"
      />

      {/* Back to home — editorial label, mirrors the "Scroll" cue style used in Hero */}
      <Link
        to="/"
        className="group absolute left-6 top-6 z-10 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant transition-colors duration-300 hover:text-primary sm:left-10 sm:top-10"
      >
        <span className="material-symbols-outlined text-[22px] leading-none transition-transform duration-300 ease-out group-hover:-translate-x-1">
          arrow_back
        </span>
        <span
          aria-hidden
          className="h-4 w-px bg-on-surface-variant/40 transition-colors duration-300 group-hover:bg-primary"
        />
        <span>Back to home</span>
      </Link>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px]"
      >
        {/* Primary card */}
        <section className="rounded-2xl border border-hairline bg-white px-8 pb-8 pt-10 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.18)] sm:px-10">
          {/* Logo + wordmark */}
          <Link to="/" className="group flex flex-col items-center gap-3">
            <span className="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/[0.03] ring-1 ring-secondary-container/30 transition-all duration-300 group-hover:ring-secondary-container/70">
              <img
                src={padroLogo}
                alt="Padro"
                className="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span className="font-serif text-[28px] font-semibold tracking-[-0.02em] text-primary">
              Padro
            </span>
          </Link>

          {/* Tagline */}
          <p className="mt-2 text-center text-[14px] text-on-surface-variant">
            Sign in to your member profile.
          </p>

          {!HAS_SUPABASE_ENV && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-lg border border-secondary-container/50 bg-secondary-container/10 p-3 text-[12px] leading-snug text-on-surface"
            >
              <svg
                viewBox="0 0 20 20"
                className="mt-0.5 h-4 w-4 shrink-0 text-secondary-container"
                fill="currentColor"
                aria-hidden
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
              </svg>
              <span>
                <strong className="text-primary">Add Supabase keys.</strong>{' '}
                Copy <code>.env.example</code> → <code>.env.local</code> and fill in{' '}
                <code>VITE_SUPABASE_URL</code> + <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
              </span>
            </div>
          )}

          {/* Action */}
          <div className="mt-8">
            <GoogleButton
              onClick={handleSignIn}
              loading={loading}
              disabled={!HAS_SUPABASE_ENV || rl.locked}
            />
          </div>

          {/* Feedback */}
          <div className="mt-3 min-h-[18px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 text-[12px] leading-snug text-secondary-container"
                  role="alert"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                  </svg>
                  <span>{error}</span>
                </motion.p>
              )}
              {rl.locked && !error && (
                <motion.p
                  key="locked"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[12px] text-on-surface-variant"
                  aria-live="polite"
                >
                  Cooling down — try again in {rl.remainingSeconds}s.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant/80">
            <span aria-hidden className="h-px flex-1 bg-hairline" />
            <span>Secure · No spam</span>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </div>

          {/* Microcopy */}
          <p className="mt-5 text-center text-[13px] leading-relaxed text-on-surface-variant">
            New here? Your profile is created automatically the first time
            you sign in.
          </p>
        </section>

        {/* Sub-card — Meta style "have an account?" companion */}
        <p className="mt-4 text-center text-[12px] text-on-surface-variant">
          Trouble signing in?{' '}
          <a
            href="mailto:hello@padro.app"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Get help
          </a>
        </p>

        {/* Tiny inline legal links — no real footer */}
        <p className="mt-10 text-center text-[11px] text-on-surface-variant/80">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-primary"
          >
            Terms
          </a>
          <span aria-hidden className="mx-2 text-on-surface-variant/40">
            ·
          </span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-primary"
          >
            Privacy
          </a>
        </p>
      </motion.div>
    </main>
  )
}
