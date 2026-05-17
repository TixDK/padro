import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Compact stat strip — pass an array of `{ label, value, hint }`. Renders a
 * 1-up grid on mobile and a 3-up grid on md+. Used by both overviews.
 *
 * Props:
 *  - items: array of stats (length 2–4 looks best)
 *  - loading: boolean — shows skeletons instead
 */
export function StatStrip({ items = [], loading = false }) {
  const reduce = useReducedMotion()

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[88px] rounded-2xl border border-hairline bg-white/80"
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={
        reduce
          ? undefined
          : {
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }
      }
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {items.map((item) => (
        <motion.article
          key={item.label}
          variants={
            reduce
              ? undefined
              : {
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }
          }
          className="group relative overflow-hidden rounded-2xl border border-hairline bg-white p-5 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.08)] transition-colors hover:border-secondary-container/60"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
            {item.label}
          </p>
          <p className="mt-2 font-serif text-[clamp(1.5rem,3vw,2rem)] leading-none tracking-[-0.02em] text-primary">
            {item.value}
          </p>
          {item.hint && (
            <p className="mt-2 text-[12px] text-on-surface-variant">
              {item.hint}
            </p>
          )}
        </motion.article>
      ))}
    </motion.div>
  )
}
