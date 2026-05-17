import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

function fmtDate(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function statusTone(status) {
  switch (status) {
    case 'confirmed':
      return { label: 'Confirmed', dot: 'bg-secondary-container' }
    case 'cancelled_by_player':
    case 'cancelled_by_trainer':
      return { label: 'Cancelled', dot: 'bg-on-surface-variant/60' }
    case 'no_show':
      return { label: 'No-show', dot: 'bg-on-surface-variant/60' }
    case 'completed':
      return { label: 'Completed', dot: 'bg-primary/70' }
    default:
      return { label: status ?? '—', dot: 'bg-on-surface-variant/60' }
  }
}

/**
 * Vertical timeline of activity entries — bookings, sessions, reviews.
 *
 * Props:
 *  - title: section title
 *  - eyebrow: small label above title
 *  - items: array of `{ id, dateIso, primary, secondary, status, badge }`
 *  - loading: boolean
 *  - emptyMessage: string shown when no items
 *  - max: optional cap
 */
export function ActivityList({
  title,
  eyebrow,
  items = [],
  loading = false,
  emptyMessage = 'Nothing here yet.',
  max = 5,
}) {
  const reduce = useReducedMotion()
  const visible = items.slice(0, max)

  return (
    <section className="rounded-2xl border border-hairline bg-white p-6 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.08)] md:p-7">
      {eyebrow && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
          {eyebrow}
        </p>
      )}
      {title && (
        <h3 className="mt-1 font-serif text-headline-md text-primary">
          {title}
        </h3>
      )}

      <div className="mt-5">
        {loading ? (
          <ul className="space-y-3">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-10 rounded bg-hairline/60" />
            ))}
          </ul>
        ) : visible.length === 0 ? (
          <p className="text-[13px] text-on-surface-variant">{emptyMessage}</p>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={
              reduce
                ? undefined
                : {
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06 } },
                  }
            }
            className="relative space-y-3 border-l border-hairline pl-5"
          >
            {visible.map((item) => {
              const tone = statusTone(item.status)
              return (
                <motion.li
                  key={item.id}
                  variants={
                    reduce
                      ? undefined
                      : {
                          hidden: { opacity: 0, x: -8 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.5, ease: EASE },
                          },
                        }
                  }
                  className="relative"
                >
                  <span
                    aria-hidden
                    className={`absolute -left-[27px] top-2 h-2 w-2 rounded-full ${tone.dot}`}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[14px] font-medium text-primary">
                      {item.primary}
                    </p>
                    <p className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
                      {fmtDate(item.dateIso)}
                    </p>
                  </div>
                  {item.secondary && (
                    <p className="mt-0.5 truncate text-[12px] text-on-surface-variant">
                      {item.secondary}
                    </p>
                  )}
                  {item.badge && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                      {item.badge}
                    </span>
                  )}
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </div>
    </section>
  )
}
