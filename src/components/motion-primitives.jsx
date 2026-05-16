import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export function Reveal({
  children,
  delay = 0,
  y = 32,
  duration = 0.9,
  amount = 0.2,
  className,
  as: Tag = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag] || motion.div

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0,
  amount = 0.15,
  as: Tag = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag] || motion.div

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

export function StaggerItem({
  children,
  className,
  y = 28,
  duration = 0.8,
  as: Tag = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag] || motion.div

  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

export const SOFT_HOVER = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 380, damping: 26 },
}
