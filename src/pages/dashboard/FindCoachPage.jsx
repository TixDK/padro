import { useTrainers } from '../../lib/hooks/useTrainers'
import { PlaceholderSection } from './_placeholder'
import { TrainerCard, TrainerCardSkeleton } from './cards/TrainerCard'

export function FindCoachPage() {
  const { data, loading, error } = useTrainers({ approved: true, limit: 24 })

  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Discover"
        title="Find a coach."
        subtitle="City, level, and language filters arrive next. For now, here are every approved coach on Padro."
      />

      {error ? (
        <p className="text-[13px] text-secondary-container">
          Couldn't load coaches. {error.message}
        </p>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <TrainerCardSkeleton key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline bg-white p-6 text-[13px] text-on-surface-variant">
          No approved coaches yet — Padro is still onboarding our first cohort.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((trainer, i) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
