import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../../auth/AuthContext'
import { useMySessions } from '../../lib/hooks/useMySessions'
import { supabase } from '../../lib/supabaseClient'
import { StatStrip } from './cards/StatStrip'
import { ActivityList } from './cards/ActivityList'

const EASE = [0.16, 1, 0.3, 1]

function fmtTime(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function isToday(iso) {
  if (!iso) return false
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function useRecentReviews(trainerId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!trainerId) return undefined
    let cancelled = false

    async function load() {
      const { data: rows, error: err } = await supabase
        .from('reviews')
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          player:profiles!player_id ( id, display_name, avatar_url )
          `,
        )
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false })
        .limit(3)
      if (cancelled) return
      if (err) {
        setError(err)
        setLoading(false)
        return
      }
      setData(rows ?? [])
      setError(null)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [trainerId])

  return { data, loading, error }
}

export function CoachOverview({ profileState }) {
  const reduce = useReducedMotion()
  const { user } = useAuth()
  const { profile, trainer, approved } = profileState
  const sessions = useMySessions()
  const reviews = useRecentReviews(trainer?.id)

  const givenName = useMemo(() => {
    const fromProfile = profile?.display_name?.split(' ')?.[0]
    return fromProfile || user?.givenName || user?.name?.split(' ')?.[0] || 'coach'
  }, [profile, user])

  const todays = sessions.data.filter((s) => isToday(s.starts_at))
  const upcoming = sessions.data
    .filter((s) => new Date(s.starts_at) > new Date())
    .slice(0, 5)

  const earningsStats = [
    {
      label: 'This month',
      value: '0 DKK',
      hint: 'Earnings populate as sessions complete.',
    },
    { label: 'Last month', value: '0 DKK', hint: 'No previous payouts yet.' },
    { label: 'All time', value: '0 DKK', hint: 'Lifetime earnings on Padro.' },
  ]

  const reviewItems = reviews.data.map((r) => ({
    id: r.id,
    dateIso: r.created_at,
    primary: `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} · ${r.player?.display_name ?? 'Player'}`,
    secondary: r.comment ?? 'No written comment.',
    status: 'completed',
  }))

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Welcome hero */}
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
          Coach workspace
        </div>
        <h1 className="mt-4 font-serif font-semibold leading-[1.02] tracking-[-0.025em] text-primary text-[clamp(2rem,5vw,3.5rem)]">
          Welcome back,{' '}
          <span className="italic text-secondary-container">{givenName}</span>.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-on-surface-variant md:text-[16px]">
          Your schedule, students, and payouts — one calm view.
        </p>
      </motion.header>

      {/* Approval banner */}
      {!approved && <ApprovalBanner />}

      {/* Earnings */}
      <section aria-labelledby="earnings">
        <h2
          id="earnings"
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant"
        >
          Earnings
        </h2>
        <StatStrip items={earningsStats} loading={false} />
      </section>

      {/* Today's schedule */}
      <section aria-labelledby="today">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
              Today
            </p>
            <h2
              id="today"
              className="mt-1 font-serif text-headline-md text-primary md:text-headline-lg"
            >
              Today's schedule
            </h2>
          </div>
        </div>

        {sessions.loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-hairline/60" />
            ))}
          </div>
        ) : sessions.error ? (
          <p className="text-[13px] text-secondary-container">
            Couldn't load schedule. {sessions.error.message}
          </p>
        ) : todays.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-hairline bg-white p-6 text-[13px] text-on-surface-variant">
            Nothing on the court today. Enjoy the rest.
          </p>
        ) : (
          <ul className="space-y-3">
            {todays.map((s) => (
              <ScheduleRow key={s.id} session={s} />
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming */}
      <section aria-labelledby="upcoming">
        <h2
          id="upcoming"
          className="mb-4 font-serif text-headline-md text-primary md:text-headline-lg"
        >
          Upcoming sessions
        </h2>
        {sessions.loading ? null : upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-hairline bg-white p-6 text-[13px] text-on-surface-variant">
            No upcoming sessions. Create one to open bookings.
          </p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((s) => (
              <UpcomingRow key={s.id} session={s} />
            ))}
          </ul>
        )}
      </section>

      {/* Recent reviews */}
      <ActivityList
        eyebrow="Recent reviews"
        title="What players are saying"
        items={reviewItems}
        loading={reviews.loading}
        emptyMessage="Your first reviews will appear here after your first completed sessions."
        max={3}
      />

      {/* CTA */}
      <CreateSessionCta disabled={!approved} />
    </div>
  )
}

function ApprovalBanner() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-col gap-3 rounded-2xl border border-secondary-container/40 bg-secondary-container/[0.08] p-5 sm:flex-row sm:items-center sm:gap-5"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/20 text-secondary-container">
        <span className="material-symbols-outlined text-[22px]" aria-hidden>
          hourglass_top
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary-container">
          Profile under review
        </p>
        <p className="mt-1 text-[14px] leading-snug text-on-surface">
          We're checking your credentials. You'll get an email the moment your
          coach profile goes live — usually within 1–2 business days.
        </p>
      </div>
    </motion.aside>
  )
}

function ScheduleRow({ session }) {
  const confirmedCount = session.bookings_confirmed?.length ?? 0
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-white p-4 transition-colors hover:border-secondary-container/55 md:p-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-primary/[0.05] py-2">
          <span className="font-serif text-[18px] leading-none text-primary">
            {fmtTime(session.starts_at)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
            {fmtTime(session.ends_at)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-[16px] text-primary">
            {session.venue?.name ?? 'Padro session'}
          </p>
          <p className="truncate text-[12px] text-on-surface-variant">
            {confirmedCount}/{session.capacity} booked
            {session.level ? ` · ${session.level}` : ''}
          </p>
        </div>
      </div>
      <Link
        to="/dashboard/sessions"
        className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:text-secondary-container"
      >
        Manage
      </Link>
    </li>
  )
}

function UpcomingRow({ session }) {
  const confirmedCount = session.bookings_confirmed?.length ?? 0
  const fmt = new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-white p-4 md:p-5">
      <div className="flex min-w-0 items-center gap-4">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant" aria-hidden>
          event
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-[16px] text-primary">
            {fmt.format(new Date(session.starts_at))} · {fmtTime(session.starts_at)}
          </p>
          <p className="truncate text-[12px] text-on-surface-variant">
            {session.venue?.name ?? '—'} · {confirmedCount}/{session.capacity} booked
          </p>
        </div>
      </div>
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
        {session.status}
      </span>
    </li>
  )
}

function CreateSessionCta({ disabled }) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border bg-white p-6 md:p-8 ${
        disabled ? 'border-hairline' : 'border-hairline'
      }`}
    >
      <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
            Next move
          </p>
          <h3 className="mt-1 font-serif text-headline-md text-primary md:text-headline-lg">
            Create a new session
          </h3>
          <p className="mt-2 max-w-md text-[13px] text-on-surface-variant">
            Set a venue, time, and price. Bookings open the moment you publish.
          </p>
        </div>
        <Link
          to="/dashboard/sessions/new"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={(e) => {
            if (disabled) e.preventDefault()
          }}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-label-md font-semibold transition-shadow duration-300 ${
            disabled
              ? 'cursor-not-allowed bg-hairline text-on-surface-variant/80'
              : 'bg-primary text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.55)] hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)]'
          }`}
        >
          <span>{disabled ? 'Awaiting approval' : 'Create session'}</span>
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
      </div>
    </section>
  )
}
