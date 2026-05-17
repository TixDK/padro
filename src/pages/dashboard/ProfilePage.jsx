import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PlaceholderSection } from './_placeholder'
import { DashboardAvatar } from './Sidebar'

export function ProfilePage() {
  const { profile, trainer, role, approved, loading } = useOutletContext()
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/3 rounded bg-hairline" />
        <div className="h-48 rounded-2xl bg-hairline/60" />
      </div>
    )
  }

  const displayName = profile?.display_name || user?.name || '—'
  const email = user?.email || '—'

  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Profile"
        title="Who you are on Padro."
        subtitle="Editing your details lands in the next prompt. For now, here's what we have on file."
      />

      <section className="rounded-2xl border border-hairline bg-white p-6 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.08)] md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <DashboardAvatar
            src={profile?.avatar_url || user?.picture}
            name={displayName}
            size={88}
            fallbackEmail={user?.email}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-on-surface-variant">
              {role === 'trainer' ? (approved ? 'Coach' : 'Coach · pending') : 'Player'}
            </p>
            <h3 className="mt-1 font-serif text-headline-lg text-primary">
              {displayName}
            </h3>
            <p className="mt-1 text-[14px] text-on-surface-variant">{email}</p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
          <Field label="City" value={profile?.city} />
          <Field label="Level" value={profile?.level} />
          <Field label="Locale" value={profile?.locale} />
          <Field label="Phone" value={profile?.phone} />
          {trainer && (
            <>
              <Field label="Headline" value={trainer.headline} />
              <Field
                label="Hourly rate"
                value={trainer.hourly_rate_dkk ? `${trainer.hourly_rate_dkk} DKK` : null}
              />
              <Field
                label="Languages"
                value={trainer.languages?.join(', ')}
              />
              <Field label="Specialties" value={trainer.specialties?.join(', ')} />
              <Field
                label="Experience"
                value={
                  trainer.experience_years
                    ? `${trainer.experience_years} years`
                    : null
                }
              />
              <Field
                label="Rating"
                value={
                  trainer.rating_avg != null
                    ? `${Number(trainer.rating_avg).toFixed(1)} (${trainer.rating_count})`
                    : null
                }
              />
            </>
          )}
        </dl>
      </section>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] text-primary">{value || '—'}</dd>
    </div>
  )
}
