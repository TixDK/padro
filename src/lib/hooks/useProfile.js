import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../../auth/AuthContext'

/**
 * The signed-in user's profile + (if applicable) their trainer row.
 *
 * Profile state lives in <AuthProvider> so we read it from there rather than
 * re-querying — that keeps everything in sync with the onboarding flow's
 * `refreshProfile()`. Trainer rows are a thin sidecar fetched here.
 *
 * Returns `{ profile, trainer, role, isCoach, approved, loading, error, refetch }`.
 */
export function useProfile() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const userId = user?.id
  const [trainer, setTrainer] = useState(null)
  // True until the first trainer fetch resolves. Stays false-effective for
  // signed-out users because no fetch ever runs (effect early-returns).
  const [trainerLoading, setTrainerLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!userId) return undefined
    let cancelled = false

    async function load() {
      const { data, error: err } = await supabase
        .from('trainers')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (cancelled) return
      // PGRST116 = "no rows" from maybeSingle — normal for players.
      if (err && err.code !== 'PGRST116') {
        setError(err)
      } else {
        setTrainer(data ?? null)
        setError(null)
      }
      setTrainerLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, tick])

  const refetch = useCallback(async () => {
    setTick((n) => n + 1)
    await refreshProfile()
  }, [refreshProfile])

  const role = profile?.role ?? 'player'
  const isCoach = role === 'trainer'
  const approved = !!trainer?.approved_at
  const loading = authLoading || (!!userId && trainerLoading)

  return {
    profile,
    trainer,
    role,
    isCoach,
    approved,
    loading,
    error,
    refetch,
  }
}
