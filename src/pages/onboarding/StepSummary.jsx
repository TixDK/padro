import { useEffect, useState } from 'react'
import { StepHeader, StepFooter } from './_components'
import { fetchVenues } from '../../lib/venues'

const LEVEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  pro: 'Pro',
}

const FREQ = {
  rarely: 'Rarely',
  monthly: 'A few times a month',
  weekly: 'Weekly',
  multiple_per_week: 'Multiple per week',
  daily: 'Daily',
}

const HAND = { right: 'Right', left: 'Left', ambidextrous: 'Ambidextrous' }
const SIDE = { left: 'Left side', right: 'Right side', either: 'Either side' }

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline/70 py-3 last:border-b-0">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
        {label}
      </span>
      <span className="break-words text-right text-[14px] text-on-surface">
        {value ? value : <span className="text-on-surface-variant/60">—</span>}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 font-serif text-[20px] font-semibold leading-tight tracking-[-0.01em] text-primary">
        {title}
      </h2>
      <div className="rounded-2xl border border-hairline bg-white px-4 py-1 sm:px-5">
        {children}
      </div>
    </section>
  )
}

export function StepSummary({ value, onSubmit, onBack, loading }) {
  const isCoach = value.role === 'trainer'
  const [venues, setVenues] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchVenues().then(({ data }) => {
      if (!cancelled) setVenues(data || [])
    })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedVenues = venues.filter((v) => value.venueIds.includes(v.id))

  return (
    <>
      <StepHeader
        eyebrow="Step 5 · Confirm"
        title="Looks good?"
        subtitle="Confirm and we'll wrap up your profile."
      />

      <div className="space-y-6">
        <Section title="Identity">
          <Row label="Role" value={isCoach ? 'Coach' : 'Player'} />
          <Row label="Display name" value={value.displayName?.trim()} />
          <Row label="City" value={value.city?.trim()} />
          <Row label="Phone" value={value.phone?.trim()} />
        </Section>

        {isCoach ? (
          <Section title="Coaching">
            <Row label="Headline" value={value.headline?.trim()} />
            <Row
              label="Hourly rate"
              value={value.hourlyRate ? `${value.hourlyRate} DKK` : ''}
            />
            <Row
              label="Experience"
              value={
                value.experienceYears
                  ? `${value.experienceYears} year${value.experienceYears === '1' ? '' : 's'}`
                  : ''
              }
            />
            <Row label="Languages" value={value.languages.join(', ')} />
            <Row
              label="Specialties"
              value={value.specialties.length ? value.specialties.join(', ') : ''}
            />
            <Row label="Bio" value={value.bio?.trim()} />
          </Section>
        ) : (
          <Section title="Your game">
            <Row label="Self-assessed level" value={LEVEL[value.level]} />
            <Row label="Plays" value={FREQ[value.playFrequency]} />
            <Row label="Years playing" value={value.yearsPlaying} />
            <Row label="Dominant hand" value={HAND[value.dominantHand]} />
            <Row label="Preferred side" value={SIDE[value.preferredSide]} />
            <Row label="Rankedin" value={value.rankedin} />
            <Row label="Playtomic" value={value.playtomic} />
            <Row label="Padel Link" value={value.padellink} />
          </Section>
        )}

        <Section title={isCoach ? 'Where you coach' : 'Where you play'}>
          <Row
            label={isCoach ? 'Venues' : 'Preferred venues'}
            value={
              selectedVenues.length
                ? selectedVenues.map((v) => v.name).join(', ')
                : ''
            }
          />
        </Section>

        {isCoach && (
          <p className="rounded-xl border border-secondary-container/50 bg-secondary-container/10 px-4 py-3 text-[12px] leading-relaxed text-on-surface">
            Heads up — coach profiles go live after a short review. We'll email
            you the moment you're approved.
          </p>
        )}
      </div>

      <StepFooter
        canContinue={!loading}
        loading={loading}
        onNext={onSubmit}
        onBack={onBack}
        nextLabel={isCoach ? 'Submit for review' : 'Finish'}
      />
    </>
  )
}
