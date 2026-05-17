import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Reveal, SOFT_HOVER } from './motion-primitives'

const MotionLink = motion(Link)

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24 text-center md:px-margin-desktop md:py-section-desktop">
      <Reveal className="mx-auto max-w-[760px]">
        <h2 className="mb-12 font-serif font-semibold leading-[0.98] tracking-[-0.03em] text-primary text-[clamp(2.5rem,7vw,88px)]">
          Find your coach.
          <br />
          <span className="italic text-secondary-container">Or become one.</span>
        </h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <MotionLink
            to="/login"
            {...SOFT_HOVER}
            className="group relative inline-flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl bg-secondary-container px-10 py-5 text-label-md font-bold text-primary shadow-[0_18px_40px_-18px_rgba(254,147,44,0.7)] transition-shadow duration-500 hover:shadow-[0_24px_50px_-16px_rgba(254,147,44,0.85)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
            />
            <span className="relative">Find a coach</span>
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
          </MotionLink>
          <MotionLink
            to="/login"
            {...SOFT_HOVER}
            className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-primary/20 px-10 py-5 text-label-md font-bold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/[0.04]"
          >
            <span>Join as a coach</span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 text-secondary-container transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 14L14 6M8 6h6v6" />
            </svg>
          </MotionLink>
        </div>
      </Reveal>
    </section>
  )
}
