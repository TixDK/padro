import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'

export function Layout() {
  const { pathname } = useLocation()
  const showScrollProgress = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      {showScrollProgress && <ScrollProgress />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
