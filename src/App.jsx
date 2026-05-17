import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { Overview } from './pages/dashboard/Overview'
import { SessionsPage } from './pages/dashboard/SessionsPage'
import { FindCoachPage } from './pages/dashboard/FindCoachPage'
import { StudentsPage } from './pages/dashboard/StudentsPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { SettingsPage } from './pages/dashboard/SettingsPage'
import { useAuth } from './auth/AuthContext'

/**
 * While Supabase is checking the session (initial getSession, or parsing the
 * ?code= query on the OAuth return) we render nothing — beats showing /login
 * for half a second before bouncing back to /dashboard.
 */
function AuthGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <span className="h-3 w-3 animate-pulse rounded-full bg-primary/40" />
    </div>
  )
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return <AuthGate />
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

function RedirectIfAuthed({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <AuthGate />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

/**
 * Authenticated routes that need a finished questionnaire. Assumes RequireAuth
 * wraps it (we trust `profile` to be loaded once `loading` is false and user
 * exists).
 */
function RequireOnboarded({ children }) {
  const { isOnboarded, loading } = useAuth()
  if (loading) return <AuthGate />
  if (!isOnboarded) return <Navigate to="/onboarding" replace />
  return children
}

function RedirectIfOnboarded({ children }) {
  const { isOnboarded, loading } = useAuth()
  if (loading) return <AuthGate />
  if (isOnboarded) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <Routes>
      {/* Login is standalone — no Layout, no nav, no footer */}
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />

      {/* Onboarding is also standalone for focus */}
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <RedirectIfOnboarded>
              <Onboarding />
            </RedirectIfOnboarded>
          </RequireAuth>
        }
      />

      {/* Marketing routes — wrapped in the public Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Backwards-compat: old /account links now land on the dashboard */}
      <Route path="/account" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard — its own chrome, auth + onboarded gated */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireOnboarded>
              <DashboardLayout />
            </RequireOnboarded>
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="find" element={<FindCoachPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
