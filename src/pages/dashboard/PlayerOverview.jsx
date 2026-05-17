import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../../auth/AuthContext'
import { useMyBookings } from '../../lib/hooks/useMyBookings'
import { useRecommendedTrainers } from '../../lib/hooks/useRecommendedTrainers'
import { NextSessionCard } from './cards/NextSessionCard'
import { StatStrip } from './cards/StatStrip'
import { TrainerCard, TrainerCardSkeleton } from './cards/TrainerCard'
import { ActivityList } from './cards/ActivityList'

const EASE = [0.16, 1, 0.3, 1]

function pickNextBooking(bookings) {
  const now = Date.now()
  return (
    bookings.find((b) => {
      const starts = b.session?.starts_at ? new Date(b.session.starts_at).getTime() : 0
      return b.status === 'confirmed' && starts > now
    }) ?? null
  )
}

function describeLevel(level) {
  if (!level) return 'Unrated'
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function PlayerOverview({ profileState }) {
  const reduce = useReducedMotion()
  const { user } = useAuth()
  const { profile } = profileState
  const bookings = useMyBookings()
  const recommended = useRecommendedTrainers({ limit: 6 })

  const givenName = useMemo(() => {
    const fromProfile = profile?.display_name?.split(' ')?.[0]
    return fromProfile || user?.givenName || user?.name?.split(' ')?.[0] || 'player'
  }, [profile, user])

  const nextBooking = useMemo(() => pickNextBooking(bookings.data), [bookings.data])

  const completedCount = useMemo(
    () => bookings.data.filter((b) => b.status === 'confirmed' && new Date(b.session?.ends_at ?? 0) < new Date()).length,
    [bookings.data],
  )

  const stats = [
    {
      label: 'Sessions completed',
      value: completedCount,
      hint: completedCount === 0 ? 'Book your first to start building history.' : 'Across all coaches.',
    },
    {
      label: 'Upcoming',
      value: bookings.data.filter((b) => b.status === 'confirmed' && new Date(b.session?.starts_at ?? 0) > new Date()).length,
      hint: 'Confirmed bookings ahead.',
    },
    {
      label: 'Level',
      value: describeLevel(profile?.level),
      hint: profile?.level ? null : 'Add your level in profile to get sharper matches.',
    },
  ]

  const activityItems = useMemo(
    () =>
      bookings.data.slice(0, 5).map((b) => ({
        id: b.id,
        dateIso: b.session?.starts_at ?? b.created_at,
        primary: b.session?.trainer?.profile?.display_name
          ? `Session with ${b.session.trainer.profile.display_name}`
          : 'Padro session',
        secondary: b.session?.venue?.name
          ? `${b.session.venue.name}${b.session.venue.city ? ` · ${b.session.venue.city}` : ''}`
          : null,
        status: b.status,
      })),
    [bookings.data],
  )

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
          You're in · Padro member
        </div>
        <h1 className="mt-4 font-serif font-semibold leading-[1.02] tracking-[-0.025em] text-primary text-[clamp(2rem,5vw,3.5rem)]">
          Welcome back,{' '}
          <span className="italic text-secondary-container">{givenName}</span>.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-on-surface-variant md:text-[16px]">
          Here's what's on deck. Pick up where you left off, or find someone
          new to train with.
        </p>
      </motion.header>

      {/* Next session */}
      <section aria-labelledby="next-session">
        <h2 id="next-session" className="sr-only">
          Next session
        </h2>
        <NextSessionCard
          booking={nextBooking}
          loading={bookings.loading}
          error={bookings.error}
          emptyCta={{
            label: 'Find a coach',
            to: '/dashboard/find',
            hint: 'Browse approved coaches near you and pick someone to train with.',
          }}
        />
      </section>

      {/* Stats */}
      <section aria-labelledby="stats">
        <h2
          id="stats"
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant"
        >
          Your activity
        </h2>
        <StatStrip items={stats} loading={bookings.loading} />
      </section>

      {/* Recommended */}
      <section aria-labelledby="recommended">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
              For you
            </p>
            <h2
              id="recommended"
              className="mt-1 font-serif text-headline-md text-primary md:text-headline-lg"
            >
              Recommended coaches
            </h2>
          </div>
        </div>

        {recommended.error ? (
          <p className="text-[13px] text-secondary-container">
            Couldn't load coaches. {recommended.error.message}
          </p>
        ) : recommended.loading ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
            {[0, 1, 2, 3].map((i) => (
              <TrainerCardSkeleton key={i} />
            ))}
          </div>
        ) : recommended.data.length === 0 ? (
          <p className="text-[13px] text-on-surface-variant">
            No approved coaches yet — check back soon.
          </p>
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
            {recommended.data.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <ActivityList
        eyebrow="Recent activity"
        title="Last 5 sessions"
        items={activityItems}
        loading={bookings.loading}
        emptyMessage="Your bookings will appear here once you start playing."
      />
    </div>
  )
}
