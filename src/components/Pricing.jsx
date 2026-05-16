import { motion } from 'framer-motion'
import { Reveal, StaggerGroup, StaggerItem, SOFT_HOVER } from './motion-primitives'
import { Eyebrow, Icon } from './Icon'

const TIERS = [
  {
    name: 'Casual Player',
    desc: 'Best for occasional match play and drills.',
    price: '€0',
    period: '/month',
    features: ['Pay per session', 'Standard court access', 'Basic profile'],
    cta: 'Start Playing',
    highlighted: false,
  },
  {
    name: 'Padro Plus',
    desc: 'For the serious athlete chasing gains.',
    price: '€29',
    period: '/month',
    features: [
      '15% off coach fees',
      'Priority court booking',
      'Monthly strategy webinar',
    ],
    cta: 'Go Plus',
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-surface py-24 md:py-section-desktop">
      <div className="mx-auto max-w-[1280px] px-6 md:px-margin-desktop">
        <Reveal className="mb-16 flex flex-col items-center text-center md:mb-20">
          <Eyebrow className="mb-4">Simple Tiers</Eyebrow>
          <h2 className="font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-primary text-[clamp(2.25rem,5.5vw,64px)]">
            Membership options
          </h2>
        </Reveal>

        <StaggerGroup
          stagger={0.15}
          className="mx-auto grid max-w-[900px] grid-cols-1 gap-gutter md:grid-cols-2"
        >
          {TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <div
                className={`relative h-full overflow-hidden bg-surface p-8 transition-colors hover:border-secondary-container sm:p-12 ${
                  tier.highlighted
                    ? 'hairline-border ring-1 ring-primary/10'
                    : 'hairline-border'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute right-0 top-0 bg-primary px-5 py-2 text-label-sm uppercase tracking-[0.18em] text-on-primary">
                    Popular
                  </div>
                )}
                <h3 className="mb-2 font-serif text-headline-lg text-primary">
                  {tier.name}
                </h3>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  {tier.desc}
                </p>
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="font-serif font-semibold leading-none text-primary text-[clamp(2.5rem,5vw,64px)]">
                    {tier.price}
                  </span>
                  <span className="text-label-md text-on-surface-variant">
                    {tier.period}
                  </span>
                </div>
                <ul className="mb-12 space-y-4">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-label-md text-on-surface"
                    >
                      <Icon
                        name="check"
                        className="text-secondary-container text-[18px]"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
                <motion.button
                  type="button"
                  {...SOFT_HOVER}
                  className={`group relative w-full cursor-pointer overflow-hidden rounded-xl py-4 text-label-md font-bold transition-all duration-500 ${
                    tier.highlighted
                      ? 'bg-primary text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.55)] hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)]'
                      : 'bg-secondary-container text-primary shadow-[0_12px_32px_-16px_rgba(254,147,44,0.6)] hover:shadow-[0_18px_42px_-14px_rgba(254,147,44,0.8)]'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%] ${
                      tier.highlighted ? 'via-secondary-container/45' : 'via-white/45'
                    }`}
                  />
                  <span className="relative inline-flex items-center justify-center gap-2">
                    {tier.cta}
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className={`h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 ${
                        tier.highlighted ? 'text-secondary-container' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
