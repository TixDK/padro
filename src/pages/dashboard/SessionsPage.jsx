import { useOutletContext } from 'react-router-dom'
import { PlaceholderSection } from './_placeholder'
import { useMyBookings } from '../../lib/hooks/useMyBookings'
import { useMySessions } from '../../lib/hooks/useMySessions'
import { ActivityList } from './cards/ActivityList'

export function SessionsPage() {
  const { isCoach } = useOutletContext()

  if (isCoach) {
    return <CoachSessions />
  }
  return <PlayerSessions />
}

function PlayerSessions() {
  const { data, loading, error } = useMyBookings()

  const items = data.map((b) => ({
    id: b.id,
    dateIso: b.session?.starts_at ?? b.created_at,
    primary: b.session?.trainer?.profile?.display_name
      ? `Session with ${b.session.trainer.profile.display_name}`
      : 'Padro session',
    secondary: b.session?.venue?.name
      ? `${b.session.venue.name}${b.session.venue.city ? ` · ${b.session.venue.city}` : ''}`
      : null,
    status: b.status,
  }))

  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Your sessions"
        title="Every booking, in one place."
        subtitle="Filtering, rescheduling, and receipts arrive in the next sprint."
      />
      {error ? (
        <p className="text-[13px] text-secondary-container">
          Couldn't load bookings. {error.message}
        </p>
      ) : (
        <ActivityList
          eyebrow="History"
          title="Your bookings"
          items={items}
          loading={loading}
          max={50}
          emptyMessage="You haven't booked a session yet."
        />
      )}
    </div>
  )
}

function CoachSessions() {
  const { data, loading, error } = useMySessions()

  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Your schedule"
        title="Sessions you're hosting."
        subtitle="Edit, cancel, and create new sessions — full management lands next."
      />
      {error ? (
        <p className="text-[13px] text-secondary-container">
          Couldn't load sessions. {error.message}
        </p>
      ) : loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-hairline/60" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline bg-white p-6 text-[13px] text-on-surface-variant">
          No sessions yet — create one to start taking bookings.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.map((s) => {
            const confirmed = s.bookings_confirmed?.length ?? 0
            return (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-white p-4 md:p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-serif text-[16px] text-primary">
                    {new Date(s.starts_at).toLocaleString('en', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="truncate text-[12px] text-on-surface-variant">
                    {s.venue?.name ?? '—'} · {confirmed}/{s.capacity} booked ·{' '}
                    {s.price_per_player_dkk} DKK/player
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  {s.status}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
