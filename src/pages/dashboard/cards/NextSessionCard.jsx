import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DashboardAvatar } from '../Sidebar'

const EASE = [0.16, 1, 0.3, 1]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

function formatTime(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function countdownTo(iso) {
  if (!iso) return null
  const diffMs = new Date(iso).getTime() - Date.now()
  if (diffMs <= 0) return 'Starting now'
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 60) return `in ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `in ${hours}h ${minutes % 60}m`
  const days = Math.floor(hours / 24)
  if (days < 7) return `in ${days}d`
  const weeks = Math.floor(days / 7)
  return `in ${weeks}w`
}

/**
 * Featured "next thing on your plate" card. Falls back to a soft empty state
 * with a routing CTA when the user has no upcoming bookings/sessions.
 *
 * Props:
 *  - booking: bookings row joined with session+venue+trainer (player view)
 *  - emptyCta: { to, label, hint } shown when booking is null
 *  - loading: boolean
 *  - error: Error | null
 */
export function NextSessionCard({ booking, emptyCta, loading, error }) {
  const reduce = useReducedMotion()

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return (
      <ErrorCard
        title="Couldn't load your next session"
        message={error.message}
      />
    )
  }

  if (!booking) {
    return <EmptyState emptyCta={emptyCta} />
  }

  const session = booking.session
  const trainerProfile = session?.trainer?.profile
  const venue = session?.venue

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_18px_50px_-30px_rgba(0,31,17,0.10)]"
    >
      {/* Atmosphere band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_90%_10%,rgba(254,147,44,0.10),transparent_70%)]"
      />

      <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
            Next session · {countdownTo(session?.starts_at)}
          </div>
          <h2 className="mt-3 font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-[-0.02em] text-primary">
            {formatDate(session?.starts_at)}{' '}
            <span className="text-on-surface-variant">·</span>{' '}
            <span className="italic text-secondary-container">
              {formatTime(session?.starts_at)}
            </span>
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-on-surface-variant">
            {venue?.name && (
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  place
                </span>
                {venue.name}
                {venue.city ? ` · ${venue.city}` : ''}
              </span>
            )}
            {trainerProfile && (
              <span className="inline-flex items-center gap-2">
                <DashboardAvatar
                  src={trainerProfile.avatar_url}
                  name={trainerProfile.display_name}
                  size={24}
                />
                <span>{trainerProfile.display_name}</span>
              </span>
            )}
          </div>
        </div>

        <Link
          to={`/dashboard/sessions`}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-label-md font-semibold text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.55)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)] md:self-center"
        >
          <span>View details</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 text-secondary-container transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </Link>
      </div>
    </motion.article>
  )
}

function Skeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-white p-6 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.06)] md:p-8">
      <div className="h-3 w-32 rounded-full bg-hairline" />
      <div className="mt-4 h-7 w-72 max-w-full rounded-md bg-hairline" />
      <div className="mt-3 h-4 w-56 max-w-full rounded-md bg-hairline/70" />
    </div>
  )
}

function EmptyState({ emptyCta }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-dashed border-hairline bg-white p-6 text-center md:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
        Nothing scheduled
      </p>
      <h2 className="mx-auto mt-3 max-w-[420px] font-serif text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight text-primary">
        {emptyCta?.title ?? (
          <>
            No sessions yet —{' '}
            <span className="italic text-secondary-container">find a coach</span>{' '}
            to get started.
          </>
        )}
      </h2>
      {emptyCta?.hint && (
        <p className="mx-auto mt-3 max-w-[440px] text-[14px] text-on-surface-variant">
          {emptyCta.hint}
        </p>
      )}
      {emptyCta?.to && (
        <Link
          to={emptyCta.to}
          className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-label-md font-semibold transition-shadow duration-300 ${
            emptyCta.disabled
              ? 'cursor-not-allowed bg-hairline text-on-surface-variant/80'
              : 'bg-primary text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.55)] hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)]'
          }`}
          onClick={(e) => {
            if (emptyCta.disabled) e.preventDefault()
          }}
        >
          <span>{emptyCta.label}</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 text-secondary-container"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </Link>
      )}
    </article>
  )
}

function ErrorCard({ title, message }) {
  return (
    <article className="rounded-2xl border border-secondary-container/40 bg-secondary-container/[0.08] p-6 text-on-surface">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary-container">
        Couldn't load
      </p>
      <h2 className="mt-2 font-serif text-headline-md text-primary">{title}</h2>
      {message && (
        <p className="mt-2 text-[13px] text-on-surface-variant">{message}</p>
      )}
    </article>
  )
}
