import { motion } from 'framer-motion'
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  SOFT_HOVER,
} from './motion-primitives'
import { Eyebrow, Icon } from './Icon'

const ITEMS = [
  {
    icon: 'space_dashboard',
    title: 'Unified Dashboard',
    body: 'Manage your schedule, bookings, and student progress from a single, beautifully crafted dashboard built for coaches.',
  },
  {
    icon: 'rocket_launch',
    title: 'Built-in Discovery',
    body: 'Get found by thousands of active players each week through curated profiles and intelligent matching.',
  },
  {
    icon: 'payments',
    title: 'Effortless Payouts',
    body: 'Automated invoicing, tax handling, and full payment protection — focus on coaching, not paperwork.',
  },
]

export function ForCoaches() {
  return (
    <section
      id="coaches"
      className="mx-auto max-w-[1280px] px-6 py-24 md:px-margin-desktop md:py-section-desktop"
    >
      <Reveal>
        <Eyebrow className="mb-6">For Coaches</Eyebrow>
        <h2 className="mb-16 max-w-[680px] font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-primary text-[clamp(2.25rem,5.5vw,64px)] md:mb-20">
          Built for your business.
        </h2>
      </Reveal>

      <StaggerGroup
        stagger={0.14}
        className="grid grid-cols-1 gap-gutter md:grid-cols-3"
      >
        {ITEMS.map((item, index) => (
          <StaggerItem key={item.title}>
            <article className="hairline-border group relative h-full overflow-hidden bg-surface p-8 transition-colors hover:border-secondary-container sm:p-12">
              <span
                aria-hidden
                className="absolute right-8 top-8 font-serif text-[13px] tracking-[0.28em] text-on-surface-variant/50 transition-colors group-hover:text-secondary-container sm:right-12 sm:top-12"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-secondary-container/15 text-secondary-container">
                <Icon name={item.icon} className="text-[28px]" />
              </div>

              <h3 className="mb-4 font-serif text-headline-lg text-primary">
                {item.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {item.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Editorial pull quote */}
      <Reveal delay={0.2} y={32}>
        <figure className="relative mx-auto mt-20 max-w-[820px] text-center md:mt-24">
          <Icon
            name="format_quote"
            fill
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-secondary-container/25 text-[80px] leading-none md:-top-10 md:text-[120px]"
          />
          <blockquote className="relative">
            <p className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] italic leading-[1.4] text-primary">
              “Padro completely transformed how I run my sessions. I focus on
              coaching, they handle the rest. My income has grown by 40% since
              joining the marketplace.”
            </p>
            <cite className="mt-8 block not-italic">
              <span className="block font-serif text-headline-md text-primary">
                Federico G.
              </span>
              <span className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                Top Tier Coach · København
              </span>
            </cite>
          </blockquote>
        </figure>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.3}>
        <div className="mt-16 flex justify-center md:mt-20">
          <motion.a
            href="#apply"
            {...SOFT_HOVER}
            className="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-label-md font-bold text-on-primary shadow-[0_10px_28px_-14px_rgba(0,31,17,0.55)] transition-all duration-500 hover:shadow-[0_18px_40px_-14px_rgba(254,147,44,0.45)] sm:px-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-secondary-container/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
            />
            <span className="relative">Apply to join</span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="relative h-3.5 w-3.5 text-secondary-container transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </motion.a>
        </div>
      </Reveal>
    </section>
  )
}
