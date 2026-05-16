import { motion } from 'framer-motion'
import { Reveal, SOFT_HOVER } from './motion-primitives'
import padroLogo from '../assets/padro.png'

const PADRO_LINKS = ['About us', 'For Coaches', 'For Players', 'Contact']
const LEGAL_LINKS = ['Privacy', 'Terms', 'Cookies', 'Help Centre']

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-on-primary-container/15 bg-primary-container text-on-primary-container">
      {/* Gold top hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary-container/45 to-transparent"
      />
      {/* Single ambient glow for atmosphere */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-secondary-container/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1240px] px-6 pt-24 md:px-margin-desktop md:pt-section-desktop">
        {/* Top: brand + newsletter */}
        <Reveal>
          <div className="grid grid-cols-1 gap-14 border-b border-on-primary-container/15 pb-16 md:grid-cols-12 md:gap-gutter md:pb-20">
            {/* Brand */}
            <div className="md:col-span-5">
              <a href="#top" className="group inline-flex items-center gap-3">
                <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-surface/10 ring-1 ring-secondary-container/40 transition-all duration-500 group-hover:ring-secondary-container/70">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(254,147,44,0.22),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <img
                    src={padroLogo}
                    alt="Padro crest"
                    className="relative h-11 w-11 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:-rotate-2"
                  />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-serif text-[28px] font-semibold tracking-[-0.02em] text-surface">
                    Padro
                  </span>
                  <span className="mt-1 font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-secondary-container">
                    Padel · Refined
                  </span>
                </span>
              </a>
              <p className="mt-8 max-w-sm text-body-md text-on-primary-container/80">
                We connect padel players with coaches and courts across
                Denmark. One platform, live availability, no phone tag.
              </p>
              <div className="mt-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-primary-container/70">
                <span
                  aria-hidden
                  className="h-px w-8 bg-secondary-container/45"
                />
                <span>København · Aarhus · Aalborg</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-6 md:col-start-7">
              <h4 className="font-serif text-[clamp(1.5rem,2.4vw,32px)] font-semibold leading-[1.15] tracking-[-0.01em] text-surface">
                The padel briefing.
              </h4>
              <p className="mt-3 max-w-md text-body-md text-on-primary-container/80">
                Quarterly notes from the courts — new coaches, training drops,
                and quiet upgrades. No noise.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="flex-1 rounded-xl border border-on-primary-container/25 bg-primary/40 px-5 py-3 text-label-md text-surface outline-none backdrop-blur-sm transition-colors placeholder:text-on-primary-container/50 focus:border-secondary-container/70"
                />
                <motion.button
                  type="submit"
                  {...SOFT_HOVER}
                  className="group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-secondary-container px-6 py-3 text-label-md font-bold text-primary shadow-[0_14px_36px_-16px_rgba(254,147,44,0.7)] transition-shadow duration-500 hover:shadow-[0_20px_44px_-14px_rgba(254,147,44,0.85)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
                  />
                  <span className="relative">Subscribe</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className="relative h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </motion.button>
              </form>
            </div>
          </div>
        </Reveal>

        {/* Link columns — 2 columns, 4 links each (8 total) */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-10 py-16 md:gap-gutter md:py-20">
            <LinkColumn title="Padro" links={PADRO_LINKS} />
            <LinkColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-on-primary-container/15 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-label-sm uppercase tracking-[0.22em] text-on-primary-container/70">
            © 2026 Padro · All rights reserved
          </p>

          <SocialLink label="LinkedIn" href="#">
            <LinkedInGlyph />
          </SocialLink>
        </div>
      </div>
    </footer>
  )
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-7 flex items-center gap-2 text-label-sm uppercase tracking-[0.22em] text-surface">
        <span
          aria-hidden
          className="h-1 w-1 rounded-full bg-secondary-container"
        />
        {title}
      </h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="group inline-flex items-center text-body-md text-on-primary-container/85 transition-colors hover:text-surface"
            >
              <span className="relative">
                {link}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-secondary-container/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ label, href, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-on-primary-container/25 bg-primary/30 text-on-primary-container/80 backdrop-blur-sm transition-all duration-300 hover:border-secondary-container/70 hover:bg-primary/55 hover:text-surface"
    >
      <span className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        {children}
      </span>
    </a>
  )
}

function LinkedInGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z" />
    </svg>
  )
}
