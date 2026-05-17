import { useEffect, useState } from 'react'
import { StepHeader, Chip, StepFooter } from './_components'
import { fetchVenues } from '../../lib/venues'

function groupByCity(venues) {
  const groups = new Map()
  for (const v of venues) {
    if (!groups.has(v.city)) groups.set(v.city, [])
    groups.get(v.city).push(v)
  }
  return Array.from(groups.entries())
}

export function StepVenues({ value, onChange, onNext, onBack, role }) {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchVenues().then(({ data, error: err }) => {
      if (cancelled) return
      if (err) setError('Could not load venues — you can finish later.')
      setVenues(data || [])
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const toggle = (id) => {
    onChange({
      venueIds: value.venueIds.includes(id)
        ? value.venueIds.filter((v) => v !== id)
        : [...value.venueIds, id],
    })
  }

  const isCoach = role === 'trainer'
  const cityGroups = groupByCity(venues)
  // Venues are not mandatory — empty selection is acceptable for both roles.
  const canContinue = true

  return (
    <>
      <StepHeader
        eyebrow="Step 4 · Where you play"
        title={isCoach ? 'Where do you coach?' : 'Where do you like to play?'}
        subtitle={
          isCoach
            ? 'Players filter coaches by venue. Pick all that apply.'
            : 'We use this to surface coaches who teach where you actually play. Skip if you want.'
        }
      />

      {loading ? (
        <div className="flex items-center gap-3 py-12">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary/40" />
          <span className="text-[13px] text-on-surface-variant">
            Loading venues…
          </span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-secondary-container/50 bg-secondary-container/10 p-4 text-[13px] text-on-surface"
        >
          {error}
        </div>
      ) : cityGroups.length === 0 ? (
        <p className="rounded-xl border border-hairline bg-white px-4 py-6 text-center text-[13px] text-on-surface-variant">
          No venues yet — we'll add yours soon.
        </p>
      ) : (
        <div className="space-y-6">
          {cityGroups.map(([city, list]) => (
            <section key={city}>
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-secondary-container"
                />
                {city}
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map((v) => (
                  <Chip
                    key={v.id}
                    selected={value.venueIds.includes(v.id)}
                    onClick={() => toggle(v.id)}
                  >
                    {v.name}
                  </Chip>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <StepFooter
        canContinue={canContinue}
        onNext={onNext}
        onBack={onBack}
        nextLabel={value.venueIds.length === 0 ? 'Skip for now' : 'Continue'}
      />
    </>
  )
}
