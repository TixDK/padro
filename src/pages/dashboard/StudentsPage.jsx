import { useMemo } from 'react'
import { useMySessions } from '../../lib/hooks/useMySessions'
import { PlaceholderSection } from './_placeholder'
import { DashboardAvatar } from './Sidebar'

export function StudentsPage() {
  const { data, loading, error } = useMySessions()

  // Derive a unique list of players who've ever booked one of my sessions.
  const players = useMemo(() => {
    const map = new Map()
    for (const s of data) {
      for (const b of s.bookings_confirmed ?? []) {
        const p = b.player
        if (!p) continue
        if (!map.has(p.id)) {
          map.set(p.id, { ...p, sessions: 1 })
        } else {
          map.get(p.id).sessions += 1
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.sessions - a.sessions)
  }, [data])

  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Your roster"
        title="My students."
        subtitle="Notes, attendance history, and direct messaging arrive next."
      />

      {error ? (
        <p className="text-[13px] text-secondary-container">
          Couldn't load students. {error.message}
        </p>
      ) : loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-hairline/60" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline bg-white p-6 text-[13px] text-on-surface-variant">
          Once players book your sessions, they'll appear here.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-white p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <DashboardAvatar src={p.avatar_url} name={p.display_name} size={36} />
                <p className="truncate font-serif text-[15px] text-primary">
                  {p.display_name}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                {p.sessions} session{p.sessions === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
