import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../../auth/AuthContext'

/**
 * Bookings the signed-in *player* is on. Joined with the session, venue, and
 * trainer profile for display. Subscribes to realtime so a new booking (e.g.
 * confirmed via webhook) shows up without a manual refresh.
 *
 * Returns `{ data, loading, error, refetch }`.
 */
export function useMyBookings() {
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
        .from('bookings')
        .select(
          `
          id,
          status,
          payment_status,
          amount_paid_dkk,
          cancellation_deadline,
          cancelled_at,
          created_at,
          session:sessions!inner (
            id,
            starts_at,
            ends_at,
            price_per_player_dkk,
            status,
            level,
            notes,
            venue:venues ( id, name, city ),
            trainer:trainers!inner (
              id,
              headline,
              profile:profiles!inner ( id, display_name, avatar_url )
            )
          )
          `,
        )
        .eq('player_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (cancelled) return
      if (err) {
        setError(err)
        setLoading(false)
        return
      }
      setData(rows ?? [])
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
      .channel(`my-bookings:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `player_id=eq.${userId}`,
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
