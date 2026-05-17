import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../lib/supabaseClient'
import { fetchProfile } from '../lib/profile'

const AuthContext = createContext(null)

/**
 * Map a Supabase user (auth.users + user_metadata from Google) into the
 * profile shape the rest of the app already expects.
 */
function mapUser(session) {
  const u = session?.user
  if (!u) return null
  const m = u.user_metadata ?? {}
  return {
    id: u.id,
    email: u.email ?? m.email ?? null,
    name: m.full_name || m.name || u.email,
    givenName: m.given_name || (m.full_name?.split(' ')[0] ?? null),
    familyName: m.family_name || (m.full_name?.split(' ').slice(1).join(' ') || null),
    picture: m.avatar_url || m.picture || null,
    emailVerified: !!u.email_confirmed_at || !!m.email_verified,
    locale: m.locale ?? null,
    provider: u.app_metadata?.provider ?? 'unknown',
    signedInAt: u.last_sign_in_at || new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  // `loading` covers the initial getSession() round-trip, any in-flight
  // OAuth callback being parsed by supabase-js, AND the follow-up profile
  // fetch. Consumers (RequireAuth, RequireOnboarded) can render a single
  // gate while everything settles.
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await fetchProfile(userId)
    setProfile(data ?? null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      const mapped = mapUser(data.session)
      setUser(mapped)
      if (mapped) await loadProfile(mapped.id)
      if (!cancelled) setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const mapped = mapUser(session)
        setUser(mapped)
        if (mapped) {
          await loadProfile(mapped.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      },
    )

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe()
    }
  }, [loadProfile])

  /**
   * Kicks off the OAuth redirect. Resolves to `{ error }` if Supabase couldn't
   * start the flow; otherwise the browser leaves the page entirely and the
   * resolution doesn't matter (we come back via `detectSessionInUrl`).
   */
  const signIn = useCallback(async ({ redirectTo } = {}) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo ?? `${window.location.origin}/account`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) await loadProfile(user.id)
  }, [user, loadProfile])

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isOnboarded: !!profile?.onboarded_at,
      loading,
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, signIn, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
