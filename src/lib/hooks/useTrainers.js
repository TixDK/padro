import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

/**
 * Lists trainers. Defaults to approved trainers only (matches the RLS read
 * policy). Joined with `profiles` for display_name / avatar / city.
 *
 * Options:
 *  - approved: boolean — include only `approved_at is not null` (default true)
 *  - limit:    number  — cap row count
 *  - orderBy:  string  — column to sort by (default 'rating_avg')
 *  - ascending: boolean — sort direction (default false)
 *
 * Returns `{ data, loading, error, refetch }`.
 */
export function useTrainers({
  approved = true,
  limit = 24,
  orderBy = 'rating_avg',
  ascending = false,
} = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      let query = supabase
        .from('trainers')
        .select(
          `
          id,
          headline,
          hourly_rate_dkk,
          languages,
          specialties,
          experience_years,
          rating_avg,
          rating_count,
          approved_at,
          profile:profiles!inner ( id, display_name, avatar_url, city, level )
          `,
        )
        .order(orderBy, { ascending, nullsFirst: false })
        .limit(limit)

      if (approved) {
        query = query.not('approved_at', 'is', null)
      }

      const { data: rows, error: err } = await query
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
  }, [approved, limit, orderBy, ascending, tick])

  return { data, loading, error, refetch }
}
