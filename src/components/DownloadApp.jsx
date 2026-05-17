import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { SOFT_HOVER } from './motion-primitives'
import { Eyebrow } from './Icon'
import { preventNav } from '../lib/scroll'

export function DownloadApp() {
  const reduce = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden border-y border-on-primary-container/15 bg-primary-container py-24 md:py-section-desktop"
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #fbf9f4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Drifting gold orbs */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-secondary-container/10 blur-3xl"
            animate={{ y: [0, -28, 0], x: [0, 18, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-32 bottom-1/5 h-96 w-96 rounded-full bg-secondary-container/[0.06] blur-3xl"
            animate={{ y: [0, 28, 0], x: [0, -18, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-[820px] px-6 text-center md:px-margin-desktop">
        {/* Top ornament */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 flex max-w-[260px] items-center gap-3"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary-container/45" />
          <motion.span
            aria-hidden
            initial={reduce ? false : { rotate: 0 }}
            whileInView={{ rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-1.5 w-1.5 bg-secondary-container"
          />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary-container/45" />
        </motion.div>

        <Eyebrow tone="light" className="mb-8 justify-center">
          Go Mobile
        </Eyebrow>

        <h2 className="mb-8 font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-surface text-[clamp(2.5rem,7vw,80px)]">
          <span className="block">
            <Word reduce={reduce} delay={0}>
              The
            </Word>{' '}
            <Word reduce={reduce} delay={0.08}>
              game,
            </Word>
          </span>
          <span className="block">
            <Word reduce={reduce} delay={0.16}>
              in
            </Word>{' '}
            <Word reduce={reduce} delay={0.24}>
              your
            </Word>{' '}
            <Word reduce={reduce} delay={0.32}>
              pocket.
            </Word>
          </span>
        </h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mb-12 max-w-md text-body-md text-on-primary-container"
        >
          Seamlessly book sessions, message your coach directly, and manage
          your favourite coaches. Everything Padro — right on your phone.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            delay: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-wrap justify-center gap-4"
        >
          <StoreBadge
            label="Download on the"
            name="App Store"
            icon="apple"
          />
          <StoreBadge label="Get it on" name="Google Play" icon="google" />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-primary-container/70"
        >
          <span className="h-px w-8 bg-secondary-container/45" />
          <span>Available now · iOS 16+ · Android 10+</span>
          <span className="h-px w-8 bg-secondary-container/45" />
        </motion.div>
      </div>
    </section>
  )
}

function Word({ children, delay = 0, reduce }) {
  if (reduce) {
    return <span className="inline-block">{children}</span>
  }
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  )
}

function StoreBadge({ label, name, icon }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xs = useSpring(x, { stiffness: 220, damping: 22 })
  const ys = useSpring(y, { stiffness: 220, damping: 22 })

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.22)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href="#"
      onClick={preventNav}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { x: xs, y: ys }}
      {...SOFT_HOVER}
      className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border border-on-primary-container/30 bg-primary/40 px-5 py-3 text-surface backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-secondary-container/70 hover:shadow-[0_18px_40px_-18px_rgba(254,147,44,0.45)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-secondary-container/40 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[420%]"
      />
      <span className="relative">
        {icon === 'apple' ? <AppleGlyph /> : <PlayGlyph />}
      </span>
      <span className="relative flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-on-primary-container">
          {label}
        </span>
        <span className="font-serif text-[18px] text-surface">{name}</span>
      </span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="relative h-3.5 w-3.5 -translate-x-1 text-secondary-container opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10h12M11 5l5 5-5 5" />
      </svg>
    </motion.a>
  )
}

function AppleGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7 fill-current"
    >
      <path d="M17.543 20.014c-.97.94-2.03.79-3.05.35-1.08-.46-2.07-.48-3.21 0-1.43.61-2.18.44-3.03-.35C2.97 14.99 3.68 7.4 9.16 7.13c1.34.07 2.27.73 3.05.79 1.17-.24 2.29-.92 3.54-.83 1.5.12 2.63.71 3.37 1.78-3.09 1.85-2.36 5.92.48 7.06-.57 1.49-1.3 2.96-2.52 4.05l-.01.04zM12.13 7.07c-.15-2.21 1.65-4.03 3.71-4.21.28 2.55-2.32 4.46-3.71 4.21z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      {/* Left (green) */}
      <path
        fill="#34A853"
        d="M1.337.924A1.486 1.486 0 0 0 1 1.882v20.236c0 .39.156.706.395.928L13.128 12 1.337.924z"
      />
      {/* Top (blue) */}
      <path
        fill="#4285F4"
        d="M17.51 7.713 14.181 11.045 1.337.924c.288-.193.687-.184 1.063.029L17.51 7.713z"
      />
      {/* Right (yellow) */}
      <path
        fill="#FBBC04"
        d="M22.018 13.298a1.49 1.49 0 0 0 0-2.594l-3.891-2.202-3.543 3.521 3.515 3.493 3.919-2.218z"
      />
      {/* Bottom (red) */}
      <path
        fill="#EA4335"
        d="M17.51 16.287 14.181 12.955 1.337 23.076c.288.193.687.184 1.063-.029L17.51 16.287z"
      />
    </svg>
  )
}
