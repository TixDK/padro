import { motion, useReducedMotion } from 'framer-motion'

const SOFT_HOVER = {
  whileHover: { y: -1 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { type: 'spring', stiffness: 380, damping: 26 },
}

export function StepHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-secondary-container">
          <span aria-hidden className="h-1 w-1 rounded-full bg-secondary-container" />
          {eyebrow}
        </span>
      )}
      <h1 className="font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-primary text-[clamp(1.75rem,3.5vw,2.5rem)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-on-surface-variant">
          {subtitle}
        </p>
      )}
    </header>
  )
}

export function FieldGroup({ label, hint, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
          {label}
          {required && (
            <span aria-hidden className="text-secondary-container">*</span>
          )}
        </span>
        {hint && (
          <span className="text-[11px] normal-case tracking-normal text-on-surface-variant/70">
            {hint}
          </span>
        )}
      </span>
      {children}
      {error && (
        <span
          role="alert"
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-secondary-container"
        >
          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
          </svg>
          {error}
        </span>
      )}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  inputMode,
  maxLength,
  autoFocus,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/45 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 ${
        error
          ? 'border-secondary-container'
          : 'border-hairline hover:border-primary/40'
      }`}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  error,
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-relaxed text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/45 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 ${
        error
          ? 'border-secondary-container'
          : 'border-hairline hover:border-primary/40'
      }`}
    />
  )
}

export function Chip({ selected, onClick, children, disabled }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      {...(disabled || reduce ? {} : SOFT_HOVER)}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
        selected
          ? 'border-primary bg-primary text-on-primary'
          : 'border-hairline bg-white text-on-surface hover:border-primary/40'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {selected && (
        <svg
          viewBox="0 0 16 16"
          className="h-3 w-3 text-secondary-container"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 8.5l3.5 3.5L13 4" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}

export function RadioRow({ options, value, onChange, columns = 2 }) {
  const reduce = useReducedMotion()
  const grid =
    columns === 3
      ? 'sm:grid-cols-3'
      : columns === 2
        ? 'sm:grid-cols-2'
        : ''
  return (
    <div role="radiogroup" className={`grid grid-cols-1 gap-2 ${grid}`}>
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            {...(reduce ? {} : SOFT_HOVER)}
            className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              selected
                ? 'border-primary bg-primary text-on-primary shadow-[0_10px_28px_-18px_rgba(0,31,17,0.4)]'
                : 'border-hairline bg-white text-on-surface hover:border-primary/40'
            }`}
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[14px] font-medium">
                {opt.label}
              </span>
              {opt.hint && (
                <span
                  className={`mt-0.5 text-[12px] ${
                    selected
                      ? 'text-on-primary-container'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {opt.hint}
                </span>
              )}
            </span>
            <span
              aria-hidden
              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                selected
                  ? 'border-secondary-container bg-secondary-container'
                  : 'border-hairline'
              }`}
            >
              {selected && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function PrimaryButton({
  onClick,
  disabled,
  loading,
  children,
  type = 'button',
}) {
  const reduce = useReducedMotion()
  const isOff = disabled || loading
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isOff}
      whileHover={!isOff && !reduce ? { y: -1 } : undefined}
      whileTap={!isOff && !reduce ? { y: 0, scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.5)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-secondary-container/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
      />
      <span className="relative inline-flex items-center gap-2">
        {loading && (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 animate-spin"
            fill="none"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2.5"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  )
}

export function GhostButton({ onClick, children, disabled }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && !reduce ? { x: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="group inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        aria-hidden
        className="inline-flex h-3.5 w-3.5 items-center justify-center transition-transform group-hover:-translate-x-0.5"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
      </span>
      {children}
    </motion.button>
  )
}

export function StepFooter({
  onBack,
  onNext,
  canContinue,
  nextLabel = 'Continue',
  loading,
  showBack = true,
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-3 border-t border-hairline pt-6">
      {showBack ? (
        <GhostButton onClick={onBack} disabled={loading}>
          Back
        </GhostButton>
      ) : (
        <span aria-hidden />
      )}
      <PrimaryButton onClick={onNext} disabled={!canContinue} loading={loading}>
        <span>{nextLabel}</span>
        <svg
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 text-secondary-container"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </PrimaryButton>
    </div>
  )
}
