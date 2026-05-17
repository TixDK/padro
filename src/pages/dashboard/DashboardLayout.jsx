import { Outlet } from 'react-router-dom'
import { ScrollProgress } from '../../components/ScrollProgress'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileTabBar } from './MobileTabBar'
import { useProfile } from '../../lib/hooks/useProfile'

/**
 * App chrome for the post-login experience. Distinct from the marketing
 * <Layout> — no Navbar, no Footer, no scroll-to-id behaviour. Light surface,
 * brand-aligned hairlines so the visual handoff from the landing page is
 * seamless.
 */
export function DashboardLayout() {
  const profileState = useProfile()

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <ScrollProgress />

      {/* Sidebar — fixed left on md+ */}
      <Sidebar profileState={profileState} />

      {/* Main column — offset on md+ to make room for the sidebar */}
      <div className="flex min-h-screen flex-col md:pl-[248px]">
        <Topbar profileState={profileState} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-10 md:pb-16 md:pt-8">
          <div className="mx-auto w-full max-w-[1240px]">
            <Outlet context={profileState} />
          </div>
        </main>
      </div>

      {/* Bottom tab bar — visible only <md */}
      <MobileTabBar profileState={profileState} />
    </div>
  )
}
