import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'padro:auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Sync across tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key !== STORAGE_KEY) return
      setUser(e.newValue ? JSON.parse(e.newValue) : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((profile) => {
    const next = {
      ...profile,
      signedInAt: new Date().toISOString(),
    }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
