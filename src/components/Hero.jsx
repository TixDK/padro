import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { StaggerGroup, StaggerItem, SOFT_HOVER } from './motion-primitives'
import heroImg from '../assets/hero.png'

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)

  // Subtle parallax on the hero image as the user scrolls past
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate overflow-hidden bg-primary-container text-surface"
    >
      {/* Atmosphere — warm golden-hour wash in the top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_10%,rgba(254,147,44,0.22),transparent_65%)]"
      />
      {/* Soft cool wash bottom-left to deepen the green */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_5%_95%,rgba(0,31,17,0.55),transparent_70%)]"
      />
      {/* Hairline grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:80px_80px]"
      />

      {/* Massive typographic watermark behind the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-6vw] hidden select-none overflow-hidden lg:block"
      >
        <p className="whitespace-nowrap text-center font-serif text-[26vw] font-bold uppercase leading-none tracking-[-0.07em] text-white/[0.025]">
          PADRO
        </p>
      </div>

      {/* Composition */}
      <div className="relative mx-auto grid min-h-[92vh] max-w-[1440px] grid-cols-1 items-center gap-12 px-6 pb-20 pt-28 md:pt-32 lg:grid-cols-12 lg:gap-12 lg:px-margin-desktop lg:pb-24">
        {/* ─────────────────────────  TYPE  ───────────────────────── */}
        <div className="relative z-10 lg:col-span-7">
          <StaggerGroup stagger={0.14} delayChildren={0.1}>
            {/* Eyebrow */}
            <StaggerItem>
              <div className="inline-flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-container opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-container" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-on-primary-container">
                  Now live · Denmark
                </span>
                <span
                  aria-hidden
                  className="hidden h-px w-14 bg-on-primary-container/35 sm:block"
                />
              </div>
            </StaggerItem>

            {/* Massive editorial headline */}
            <StaggerItem>
              <h1 className="mt-10 font-serif font-semibold leading-[0.9] tracking-[-0.035em] text-surface text-[clamp(3.25rem,9vw,148px)]">
                <span className="block overflow-hidden">
                  <span className="block">Your coach.</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block">Your game.</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block italic text-secondary-container">
                    Your obsession.
                  </span>
                </span>
              </h1>
            </StaggerItem>

            {/* Restrained subtitle */}
            <StaggerItem>
              <p className="mt-10 max-w-md text-[17px] leading-relaxed text-on-primary-container md:text-[18px]">
                A direct line between Denmark's padel players and their
                coach. Fair price. Fair pay.
              </p>
            </StaggerItem>

            {/* CTA + secondary link */}
            <StaggerItem>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
                <motion.a
                  href="#find"
                  {...SOFT_HOVER}
                  className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl bg-secondary-container px-10 py-5 text-label-md font-bold text-primary shadow-[0_22px_50px_-18px_rgba(254,147,44,0.8)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-18px_rgba(254,147,44,1)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
                  />
                  <span className="relative">Find your coach</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className="relative h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </motion.a>

                <a
                  href="#how"
                  className="group inline-flex items-center gap-3 text-label-md text-on-primary-container transition-colors hover:text-surface"
                >
                  <span>How it works</span>
                  <span
                    aria-hidden
                    className="h-px w-7 origin-left bg-on-primary-container/50 transition-all duration-500 group-hover:w-12 group-hover:bg-surface"
                  />
                </a>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        {/* ─────────────────────────  IMAGE  ───────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.25,
          }}
          className="relative z-10 lg:col-span-5"
        >
          <div className="relative mx-auto w-full max-w-[460px] lg:ml-auto lg:mr-0">
            {/* Subtle offset accent panels */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-secondary-container/45"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-3 -translate-y-3 rounded-3xl border border-on-primary-container/35"
            />

            {/* Image card */}
            <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-primary shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)]">
              <motion.img
                src={heroImg}
                alt="A padel player mid-smash on a glass-walled court at golden hour"
                style={reduce ? undefined : { y: imgY }}
                loading="eager"
                decoding="async"
                className="absolute inset-x-0 top-[-6%] h-[115%] w-full object-cover object-center"
              />
              {/* Bottom gradient for type legibility */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent"
              />

              {/* Editorial photo credit */}
              <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-surface/75">
                  Golden hour · DK · 2026
                </span>
                <span className="font-serif italic text-[12px] leading-none text-surface/70">
                  no.&thinsp;001
                </span>
              </figcaption>
            </figure>
          </div>
        </motion.div>
      </div>

      {/* Bottom signature strip */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-8 lg:px-margin-desktop">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between border-t border-on-primary-container/20 pt-6 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-primary-container/70"
        >
          <span className="hidden sm:inline">
            Padro Atelier — Coaches, paid fairly.
          </span>
          <span className="sm:hidden">Padro</span>
          <a
            href="#why"
            className="group inline-flex items-center gap-3 transition-colors hover:text-surface"
          >
            <span>Scroll</span>
            <span
              aria-hidden
              className="inline-flex h-7 w-px bg-on-primary-container/40 transition-colors group-hover:bg-surface"
            />
            <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-y-0.5">
              arrow_downward
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
