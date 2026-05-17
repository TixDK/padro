import { motion, useReducedMotion } from 'framer-motion'

export function ProgressBar({ step, total, label }) {
  const reduce = useReducedMotion()
  const pct = Math.max(0, Math.min(100, (step / total) * 100))
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
        <span>
          Step {step} of {total}
          {label && (
            <>
              <span aria-hidden className="mx-2 text-on-surface-variant/40">·</span>
              <span className="text-primary">{label}</span>
            </>
          )}
        </span>
        <span className="text-on-surface-variant/70">{Math.round(pct)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        className="relative h-[3px] w-full overflow-hidden rounded-full bg-hairline"
      >
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-secondary-container"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </div>
    </div>
  )
}
