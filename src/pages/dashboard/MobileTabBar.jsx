import { NavLink } from 'react-router-dom'

function buildTabs(isCoach) {
  return [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard', end: true },
    { to: '/dashboard/sessions', label: 'Sessions', icon: 'event' },
    isCoach
      ? { to: '/dashboard/students', label: 'Students', icon: 'groups' }
      : { to: '/dashboard/find', label: 'Find', icon: 'search' },
    { to: '/dashboard/profile', label: 'Profile', icon: 'person' },
  ]
}

export function MobileTabBar({ profileState }) {
  const tabs = buildTabs(profileState.isCoach)

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                    aria-hidden
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
