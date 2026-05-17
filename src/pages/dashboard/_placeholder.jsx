import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Lightweight section header used at the top of placeholder pages so they
 * still feel like part of the same atelier as the marketing site.
 */
export function PlaceholderSection({ eyebrow, title, subtitle }) {
  const reduce = useReducedMotion()
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {eyebrow && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mt-2 font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-primary text-[clamp(1.75rem,4vw,2.5rem)]">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-on-surface-variant md:text-[15px]">
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}
