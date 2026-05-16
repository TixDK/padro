import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { SOFT_HOVER } from './motion-primitives'
import padroLogo from '../assets/padro.png'
import { useAuth } from '../auth/AuthContext'

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'For Players', href: '#players' },
  { label: 'For Coaches', href: '#coaches' },
]

export function Navbar() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.nav
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 w-full border-b transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-hairline bg-surface/95 shadow-[0_8px_24px_-18px_rgba(0,31,17,0.25)] backdrop-blur-md'
          : 'border-transparent bg-surface'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 md:h-[72px] lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex flex-shrink-0 items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/[0.04] ring-1 ring-secondary-container/30 transition-all duration-300 group-hover:ring-secondary-container/70 sm:h-10 sm:w-10">
            <img
              src={padroLogo}
              alt="Padro"
              className="relative h-8 w-8 object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:h-9 sm:w-9"
            />
          </span>
          <span className="font-serif text-[20px] font-semibold tracking-[-0.02em] text-primary sm:text-[22px]">
            Padro
          </span>
        </Link>

        {/* Center navigation (desktop) */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const isActive = active === link.label
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className="group relative inline-flex cursor-pointer items-center rounded-lg px-3.5 py-2 text-label-md font-medium transition-colors duration-200"
                >
                  {isActive && !reduce && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/[0.06]"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative ${
                      isActive
                        ? 'text-primary'
                        : 'text-on-surface-variant transition-colors group-hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <motion.div {...SOFT_HOVER} className="hidden sm:inline-flex">
              <Link
                to="/account"
                aria-label={`Account · ${user?.name || ''}`}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-white px-1 py-1 pr-3.5 text-label-md text-primary shadow-[0_8px_20px_-14px_rgba(0,31,17,0.35)] transition-[border-color,box-shadow] duration-300 hover:border-secondary-container/55 hover:shadow-[0_14px_28px_-14px_rgba(254,147,44,0.35)]"
              >
                <Avatar user={user} size={32} />
                <span className="hidden max-w-[120px] truncate text-[13px] font-medium md:inline">
                  {user?.givenName || user?.name?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div {...SOFT_HOVER} className="hidden sm:inline-flex">
              <Link
                to="/login"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-medium text-on-primary shadow-[0_8px_20px_-12px_rgba(0,31,17,0.5)] transition-shadow duration-300 hover:shadow-[0_12px_28px_-12px_rgba(254,147,44,0.4)] sm:px-5 sm:py-2.5"
              >
                <span>Sign in</span>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5 text-secondary-container"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </Link>
            </motion.div>
          )}

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-hairline text-primary transition-colors hover:bg-primary/[0.04] md:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full border-b border-hairline bg-surface/98 shadow-[0_16px_40px_-20px_rgba(0,31,17,0.25)] backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-3 sm:px-6">
              {LINKS.map((link) => {
                const isActive = active === link.label
                return (
                  <li key={link.label}>
                    <a
                      onClick={() => {
                        setOpen(false)
                        setActive(link.label)
                      }}
                      href={link.href}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-primary/[0.04] ${
                        isActive ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-secondary-container"
                          />
                        )}
                        {link.label}
                      </span>
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 text-on-surface-variant"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 5l5 5-5 5" />
                      </svg>
                    </a>
                  </li>
                )
              })}
              <li className="mt-1 px-1 pb-1 sm:hidden">
                {isAuthenticated ? (
                  <Link
                    onClick={() => setOpen(false)}
                    to="/account"
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-hairline bg-white p-2 pr-4 text-label-md font-medium text-primary"
                  >
                    <span className="flex items-center gap-3">
                      <Avatar user={user} size={36} />
                      <span className="flex flex-col leading-tight">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                          Signed in
                        </span>
                        <span className="truncate text-[14px]">
                          {user?.name || user?.email}
                        </span>
                      </span>
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 text-secondary-container"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    onClick={() => setOpen(false)}
                    to="/login"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md font-medium text-on-primary"
                  >
                    <span>Sign in</span>
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 text-secondary-container"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Avatar({ user, size = 32 }) {
  const [failed, setFailed] = useState(false)
  const initials = (user?.name || user?.email || '?')
    .split(/[\s.@]+/)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
  const style = { width: size, height: size }

  if (user?.picture && !failed) {
    return (
      <img
        src={user.picture}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={style}
        className="rounded-full object-cover ring-1 ring-hairline"
      />
    )
  }

  return (
    <span
      aria-hidden
      style={style}
      className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary"
    >
      <span className="font-serif text-[12px]">{initials}</span>
    </span>
  )
}
