import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DashboardAvatar } from '../Sidebar'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Trainer summary card. Renders avatar, name, headline, city, rating, hourly
 * rate, and a discreet CTA. Designed for horizontal scrolling rows (player
 * overview) but works in a grid too.
 *
 * Props:
 *  - trainer: row from useTrainers
 *  - to: string — destination link (optional, defaults to /dashboard/find)
 *  - index: number — for stagger delay
 */
export function TrainerCard({ trainer, to, index = 0 }) {
  const reduce = useReducedMotion()
  const profile = trainer?.profile

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: EASE,
        delay: reduce ? 0 : Math.min(index * 0.08, 0.4),
      }}
      whileHover={reduce ? undefined : { y: -2 }}
      className="group relative flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-hairline bg-white p-5 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.08)] transition-colors hover:border-secondary-container/60"
    >
      <div className="flex items-center gap-3">
        <DashboardAvatar
          src={profile?.avatar_url}
          name={profile?.display_name}
          size={44}
        />
        <div className="min-w-0">
          <p className="truncate font-serif text-[16px] leading-tight text-primary">
            {profile?.display_name ?? 'Coach'}
          </p>
          {profile?.city && (
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              {profile.city}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-on-surface-variant">
        {trainer?.headline ?? 'Padro coach'}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4 text-[12px] text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary-container" aria-hidden>
            star
          </span>
          <span className="font-semibold text-primary">
            {trainer?.rating_avg != null
              ? Number(trainer.rating_avg).toFixed(1)
              : '—'}
          </span>
          <span>({trainer?.rating_count ?? 0})</span>
        </span>
        {trainer?.hourly_rate_dkk != null && (
          <span className="font-semibold text-primary">
            {trainer.hourly_rate_dkk} DKK
            <span className="font-normal text-on-surface-variant">/hr</span>
          </span>
        )}
      </div>

      <Link
        to={to ?? '/dashboard/find'}
        className="absolute inset-0"
        aria-label={`View ${profile?.display_name ?? 'coach'}`}
      />
    </motion.article>
  )
}

export function TrainerCardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 snap-start rounded-2xl border border-hairline bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-hairline" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-hairline" />
          <div className="h-3 w-20 rounded bg-hairline/70" />
        </div>
      </div>
      <div className="mt-4 h-8 rounded bg-hairline/60" />
      <div className="mt-5 h-4 rounded bg-hairline/60" />
    </div>
  )
}
