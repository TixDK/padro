import { motion, useReducedMotion } from 'framer-motion'
import { StepHeader } from './_components'

const ROLES = [
  {
    value: 'player',
    title: "I'm a player",
    body: 'Find a coach who fits your level, your schedule, and your goals.',
    icon: 'sports_tennis',
  },
  {
    value: 'trainer',
    title: "I'm a coach",
    body: 'Get found by motivated players. Set your price, own your calendar.',
    icon: 'sports',
  },
]

export function StepRole({ value, onChange, onNext }) {
  const reduce = useReducedMotion()

  const choose = (role) => {
    onChange(role)
    // Give the tick a moment to land before transitioning.
    window.setTimeout(() => onNext(), reduce ? 0 : 360)
  }

  return (
    <>
      <StepHeader
        eyebrow="Step 1 · Role"
        title="Are you a player or a coach?"
        subtitle="We'll tailor the rest of the questionnaire to your role."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const selected = value === role.value
          return (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => choose(role.value)}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { y: 0, scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              aria-pressed={selected}
              className={`group relative flex h-full cursor-pointer flex-col items-start gap-3 overflow-hidden rounded-2xl border-2 px-6 py-7 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:px-7 sm:py-8 ${
                selected
                  ? 'border-primary bg-primary text-on-primary shadow-[0_18px_50px_-30px_rgba(0,31,17,0.45)]'
                  : 'border-hairline bg-white text-primary hover:border-primary/40 hover:shadow-[0_10px_30px_-18px_rgba(0,31,17,0.18)]'
              }`}
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  selected
                    ? 'bg-secondary-container/20 text-secondary-container'
                    : 'bg-secondary-container/15 text-secondary-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  {role.icon}
                </span>
              </span>

              <span className="font-serif text-[22px] font-semibold leading-tight tracking-[-0.01em]">
                {role.title}
              </span>

              <span
                className={`text-[13px] leading-relaxed ${
                  selected ? 'text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                {role.body}
              </span>

              {selected && (
                <span
                  aria-hidden
                  className="absolute right-5 top-5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-primary"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8.5l3.5 3.5L13 4" />
                  </svg>
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="mt-8 text-[12px] text-on-surface-variant/70">
        Tap a card to continue. You can change this later in your account.
      </p>
    </>
  )
}
