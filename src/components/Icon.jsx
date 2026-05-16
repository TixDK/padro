export function Icon({ name, className = '', fill = false, weight, style }) {
  const variation = []
  if (fill) variation.push('"FILL" 1')
  if (weight) variation.push(`"wght" ${weight}`)

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: variation.length ? variation.join(', ') : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

export function Eyebrow({ children, tone = 'dark', className = '' }) {
  const toneClass =
    tone === 'light' ? 'text-on-primary-container' : 'text-on-surface-variant'
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-[10px] text-secondary-container leading-none">●</span>
      <span
        className={`text-label-sm uppercase tracking-[0.18em] ${toneClass}`}
      >
        {children}
      </span>
    </div>
  )
}
