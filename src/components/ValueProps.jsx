import { Reveal, StaggerGroup, StaggerItem } from './motion-primitives'
import { Eyebrow, Icon } from './Icon'

const ITEMS = [
  {
    icon: 'workspace_premium',
    title: 'Credentials and ratings, upfront',
    body: 'Every coach shows their certifications, experience, and price before you book. Sessions are rated by the players who actually took them — so what you see is what you get.',
  },
  {
    icon: 'tune',
    title: 'Find your match in a single feed',
    body: 'Filter coaches by city, level, language, and price. Padro is the introduction — once you pick a coach, the two of you choose where to play.',
  },
  {
    icon: 'schedule',
    title: 'A calendar that bends to yours',
    body: 'Live availability, instant confirmation, easy reschedule. Sunrise drills or floodlit late nights — no phone tag, no chasing anyone over Messenger.',
  },
]

export function ValueProps() {
  return (
    <section
      id="players"
      className="mx-auto max-w-[1280px] px-6 py-24 md:px-margin-desktop md:py-section-desktop"
    >
      <Reveal>
        <Eyebrow className="mb-6">For Players</Eyebrow>
        <h2 className="mb-16 max-w-[680px] font-serif font-semibold leading-[1.05] tracking-[-0.02em] text-primary text-[clamp(2.25rem,5.5vw,64px)] md:mb-20">
          Built for your game.
        </h2>
      </Reveal>

      <StaggerGroup
        stagger={0.14}
        className="grid grid-cols-1 gap-gutter md:grid-cols-3"
      >
        {ITEMS.map((item, index) => (
          <StaggerItem key={item.title}>
            <article className="hairline-border group relative h-full overflow-hidden bg-surface p-8 transition-colors hover:border-secondary-container sm:p-12">
              {/* Subtle serif index, mirrors the editorial tone */}
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
    </section>
  )
}
