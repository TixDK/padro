import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../auth/AuthContext'
import padroLogo from '../../assets/padro.png'

const EASE = [0.16, 1, 0.3, 1]
const SPRING = { type: 'spring', stiffness: 380, damping: 26 }

// Hoisted so the motion-wrapped NavLink isn't recreated each render.
const MotionNavLink = motion(NavLink)

function buildNavItems(isCoach) {
  return [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard', end: true },
    { to: '/dashboard/sessions', label: 'Sessions', icon: 'event' },
    isCoach
      ? { to: '/dashboard/students', label: 'My students', icon: 'groups' }
      : { to: '/dashboard/find', label: 'Find a coach', icon: 'search' },
    { to: '/dashboard/profile', label: 'Profile', icon: 'person' },
    { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
  ]
}

export function Sidebar({ profileState }) {
  const reduce = useReducedMotion()
  const { isCoach, approved } = profileState
  const items = buildNavItems(isCoach)

  return (
    <aside
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-hairline bg-white/70 backdrop-blur-md md:flex"
    >
      {/* Wordmark */}
      <Link
        to="/dashboard"
        className="group flex items-center gap-2.5 border-b border-hairline px-6 py-5"
      >
        <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/[0.04] ring-1 ring-secondary-container/30 transition-all duration-300 group-hover:ring-secondary-container/70">
          <img
            src={padroLogo}
            alt="Padro"
            className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </span>
        <span className="font-serif text-[20px] font-semibold tracking-[-0.02em] text-primary">
          Padro
        </span>
      </Link>

      {/* Section label */}
      <p className="px-6 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant/75">
        Workspace
      </p>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.to}>
              <SidebarNavItem item={item} reduce={reduce} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Identity / menu */}
      <div className="border-t border-hairline px-3 py-3">
        <IdentityMenu profileState={profileState} reduce={reduce} approved={approved} />
      </div>
    </aside>
  )
}

function SidebarNavItem({ item, reduce }) {
  return (
    <MotionNavLink
      to={item.to}
      end={item.end}
      whileHover={reduce ? undefined : { x: 2 }}
      transition={SPRING}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md transition-colors ${
          isActive
            ? 'bg-primary/[0.06] text-primary'
            : 'text-on-surface-variant hover:bg-primary/[0.03] hover:text-primary'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !reduce && (
            <motion.span
              layoutId="sidebar-active"
              aria-hidden
              className="absolute inset-y-1 left-0 w-[3px] rounded-r-full bg-secondary-container"
              transition={SPRING}
            />
          )}
          <span
            className={`material-symbols-outlined text-[20px] ${
              isActive ? 'text-primary' : 'text-on-surface-variant/80 group-hover:text-primary'
            }`}
            aria-hidden
          >
            {item.icon}
          </span>
          <span className="font-medium">{item.label}</span>
        </>
      )}
    </MotionNavLink>
  )
}

function IdentityMenu({ profileState, reduce, approved }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { profile, isCoach } = profileState
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

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/', { replace: true })
  }

  const displayName =
    profile?.display_name || user?.name || user?.email || 'Padro member'
  const avatarUrl = profile?.avatar_url || user?.picture
  const roleLabel = isCoach
    ? approved
      ? 'Coach'
      : 'Coach · pending'
    : 'Player'

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-primary/[0.04]"
      >
        <DashboardAvatar
          src={avatarUrl}
          name={displayName}
          size={36}
          fallbackEmail={user?.email}
        />
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] font-medium text-primary">
            {displayName}
          </span>
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
            {roleLabel}
          </span>
        </span>
        <span
          className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            ref={menuRef}
            initial={reduce ? false : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            style={{ originY: 1, originX: 0 }}
            role="menu"
            className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_18px_50px_-30px_rgba(0,31,17,0.25)]"
          >
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

/**
 * Local avatar — kept inline so the dashboard doesn't reach into the
 * marketing component tree.
 */
export function DashboardAvatar({ src, name, size = 36, fallbackEmail }) {
  const [failed, setFailed] = useState(false)
  const initials = (name || fallbackEmail || '?')
    .split(/[\s.@]+/)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
  const style = { width: size, height: size }

  if (src && !failed) {
    return (
      <img
        src={src}
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
      className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary ring-1 ring-hairline"
    >
      <span className="font-serif text-[12px]">{initials || '?'}</span>
    </span>
  )
}

/* Keep ease constant exported in case sibling components want to match. */
export { EASE }
