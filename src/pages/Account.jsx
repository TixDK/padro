import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'

export function Account() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [imgFailed, setImgFailed] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/', { replace: true })
  }

  const initials = (user?.name || user?.email || '?')
    .split(/[\s.@]+/)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  const signedInDate = user?.signedInAt
    ? new Date(user.signedInAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <section className="relative isolate flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-primary-container py-16 text-surface md:py-24">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(254,147,44,0.18),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:80px_80px]"
      />

      <div className="relative mx-auto w-full max-w-[860px] px-6 md:px-margin-desktop">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-secondary-container" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-on-primary-container">
              You're in · Padro Member
            </span>
          </div>

          <h1 className="mt-8 font-serif font-semibold leading-[0.95] tracking-[-0.035em] text-surface text-[clamp(2.25rem,5.5vw,56px)]">
            Welcome,{' '}
            <span className="italic text-secondary-container">
              {user?.givenName || user?.name || 'player'}
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-on-primary-container">
            Your member profile is live. Pick a coach when you're ready —
            we'll handle the rest.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15,
          }}
          className="relative mt-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-secondary-container/30"
          />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-primary/55 p-6 backdrop-blur-xl shadow-[0_50px_120px_-40px_rgba(0,0,0,0.55)] sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_180deg,rgba(254,147,44,0.6),rgba(117,160,133,0.4),rgba(254,147,44,0.6))] opacity-90 blur-[3px]"
                />
                {user?.picture && !imgFailed ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'Profile photo'}
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="relative h-20 w-20 rounded-full object-cover ring-2 ring-primary"
                  />
                ) : (
                  <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary ring-2 ring-primary">
                    <span className="font-serif text-[22px]">{initials}</span>
                  </span>
                )}
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-serif text-[24px] leading-tight text-surface">
                    {user?.name || 'Padro member'}
                  </p>
                  {user?.emailVerified && (
                    <span
                      title="Email verified"
                      aria-label="Email verified"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container/20 text-secondary-container"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M4 10.5l4 4 8-9" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-[14px] text-on-primary-container">
                  {user?.email}
                </p>
                {signedInDate && (
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-primary-container/70">
                    Signed in · {signedInDate}
                  </p>
                )}
              </div>

              {/* Sign out */}
              <SignOutButton onClick={handleSignOut} />
            </div>

            {/* Quick links */}
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              <QuickLink
                title="Browse coaches"
                hint="Filter by city, level, language"
                to="/"
                scrollTarget="coaches"
              />
              <QuickLink
                title="How it works"
                hint="The Padro promise, in 60s"
                to="/"
                scrollTarget="players"
              />
              <QuickLink
                title="Become a coach"
                hint="Get paid what you're worth"
                to="/"
                scrollTarget="coaches"
              />
            </div>
          </div>
        </motion.div>

        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-primary-container/70">
          <Link to="/" className="hover:text-surface">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  )
}

function QuickLink({ title, hint, to, scrollTarget }) {
  return (
    <Link
      to={to}
      state={scrollTarget ? { scrollTo: scrollTarget } : undefined}
      className="group flex flex-col rounded-2xl border border-white/10 bg-primary/40 p-4 transition-colors hover:border-secondary-container/45 hover:bg-primary/60"
    >
      <span className="flex items-center justify-between">
        <span className="font-serif text-[16px] text-surface">{title}</span>
        <svg
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 text-on-primary-container transition-transform group-hover:translate-x-0.5 group-hover:text-secondary-container"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </span>
      <span className="mt-1 text-[12px] text-on-primary-container/85">
        {hint}
      </span>
    </Link>
  )
}

function SignOutButton({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-primary/35 px-4 py-2.5 text-label-md text-surface transition-colors hover:border-secondary-container/55 hover:bg-primary/55"
    >
      <span>Sign out</span>
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 text-on-primary-container transition-colors group-hover:text-secondary-container"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M13 14l5-4-5-4M18 10H8M11 18H4V2h7" />
      </svg>
    </motion.button>
  )
}

