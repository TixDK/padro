import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../auth/AuthContext'
import { DashboardAvatar } from './Sidebar'

const TITLES = [
  { match: /^\/dashboard\/sessions/, title: 'Sessions' },
  { match: /^\/dashboard\/find/, title: 'Find a coach' },
  { match: /^\/dashboard\/students/, title: 'My students' },
  { match: /^\/dashboard\/profile/, title: 'Profile' },
  { match: /^\/dashboard\/settings/, title: 'Settings' },
  { match: /^\/dashboard$/, title: 'Overview' },
]

function resolveTitle(pathname) {
  for (const entry of TITLES) {
    if (entry.match.test(pathname)) return entry.title
  }
  return 'Dashboard'
}

export function Topbar({ profileState }) {
  const location = useLocation()
  const title = resolveTitle(location.pathname)

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 md:h-[72px] md:px-10">
        {/* Eyebrow + title */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant/75">
            Dashboard
          </p>
          <h1 className="truncate font-serif text-[20px] leading-tight text-primary md:text-[22px]">
            {title}
          </h1>
        </div>

        {/* Search — placeholder for now, kept visually quiet */}
        <div className="relative hidden lg:block">
          <span
            className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/70"
            aria-hidden
          >
            search
          </span>
          <input
            type="search"
            placeholder="Search coaches, sessions…"
            disabled
            aria-label="Search (coming soon)"
            className="h-10 w-[260px] rounded-full border border-hairline bg-white/70 pl-9 pr-3 text-[13px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary-container/40 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        {/* Notifications — placeholder */}
        <button
          type="button"
          aria-label="Notifications (coming soon)"
          disabled
          className="relative inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-hairline bg-white/70 text-on-surface-variant transition-colors hover:text-primary disabled:opacity-70"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden>
            notifications
          </span>
          <span
            aria-hidden
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary-container"
          />
        </button>

        {/* Avatar dropdown — mobile/tablet only (md sidebar shows it) */}
        <div className="md:hidden">
          <AvatarMenu profileState={profileState} />
        </div>
      </div>
    </header>
  )
}

function AvatarMenu({ profileState }) {
  const reduce = useReducedMotion()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { profile, isCoach, approved } = profileState
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onClick = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const displayName = profile?.display_name || user?.name || user?.email || 'Member'
  const avatarUrl = profile?.avatar_url || user?.picture
  const roleLabel = isCoach ? (approved ? 'Coach' : 'Coach · pending') : 'Player'

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center rounded-full border border-hairline bg-white p-1 transition-colors hover:border-secondary-container/55"
      >
        <DashboardAvatar
          src={avatarUrl}
          name={displayName}
          size={32}
          fallbackEmail={user?.email}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="topbar-menu"
            ref={menuRef}
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            style={{ originX: 1, originY: 0 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_18px_50px_-30px_rgba(0,31,17,0.3)]"
          >
            <div className="border-b border-hairline px-3 py-3">
              <p className="truncate text-[13px] font-medium text-primary">
                {displayName}
              </p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                {roleLabel}
              </p>
            </div>
            <Link
              to="/dashboard/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2.5 text-label-md text-on-surface hover:bg-primary/[0.04]"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden>
                person
              </span>
              Profile
            </Link>
            <Link
              to="/dashboard/settings"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2.5 text-label-md text-on-surface hover:bg-primary/[0.04]"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden>
                settings
              </span>
              Settings
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              role="menuitem"
              className="flex w-full cursor-pointer items-center gap-2 border-t border-hairline px-3 py-2.5 text-left text-label-md text-on-surface hover:bg-primary/[0.04]"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden>
                logout
              </span>
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
