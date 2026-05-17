import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../../auth/AuthContext'

/**
 * Sessions the signed-in *coach* is hosting, joined with venue and a
 * confirmed-booking count so the UI can render "3/4 booked" without a
 * second round-trip. Realtime: refetch when own sessions mutate.
 */
export function useMySessions() {
  const { user } = useAuth()
  const userId = user?.id
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    if (!userId) return undefined
    let cancelled = false

    async function load() {
      const { data: rows, error: err } = await supabase
        .from('sessions')
        .select(
          `
          id,
          starts_at,
          ends_at,
          capacity,
          price_per_player_dkk,
          level,
          notes,
          status,
          venue:venues ( id, name, city ),
          bookings ( id, status, player:profiles ( id, display_name, avatar_url ) )
          `,
        )
        .eq('trainer_id', userId)
        .order('starts_at', { ascending: true })
        .limit(50)

      if (cancelled) return
      if (err) {
        setError(err)
        setLoading(false)
        return
      }
      const shaped = (rows ?? []).map((s) => ({
        ...s,
        bookings_confirmed: (s.bookings ?? []).filter(
          (b) => b.status === 'confirmed',
        ),
      }))
      setData(shaped)
      setError(null)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, tick])

  useEffect(() => {
    if (!userId) return undefined
    const channel = supabase
      .channel(`my-sessions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `trainer_id=eq.${userId}`,
        },
        () => {
          setTick((n) => n + 1)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { data, loading, error, refetch }
}
