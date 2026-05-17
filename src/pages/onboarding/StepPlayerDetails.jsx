import {
  StepHeader,
  FieldGroup,
  TextInput,
  RadioRow,
  StepFooter,
} from './_components'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner', hint: 'Picking up the paddle' },
  { value: 'intermediate', label: 'Intermediate', hint: 'Holding rallies, learning tactics' },
  { value: 'advanced', label: 'Advanced', hint: 'Reading the game, league play' },
  { value: 'pro', label: 'Pro', hint: 'Tournament-tested' },
]

const FREQ_OPTIONS = [
  { value: 'rarely', label: 'Rarely' },
  { value: 'monthly', label: 'A few times a month' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'multiple_per_week', label: 'Multiple per week' },
  { value: 'daily', label: 'Daily' },
]

const HAND_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'ambidextrous', label: 'Ambidextrous' },
]

const SIDE_OPTIONS = [
  { value: 'left', label: 'Left side' },
  { value: 'right', label: 'Right side' },
  { value: 'either', label: "Either's fine" },
]

function rangeError(raw, min, max, { integer = false } = {}) {
  const v = (raw || '').trim()
  if (v === '') return { ok: false, err: null, empty: true }
  const n = Number(v)
  if (!Number.isFinite(n)) return { ok: false, err: 'Numbers only.' }
  if (integer && !Number.isInteger(n)) return { ok: false, err: 'Whole numbers only.' }
  if (n < min || n > max) return { ok: false, err: `Between ${min} and ${max}.` }
  return { ok: true, err: null }
}

export function StepPlayerDetails({ value, onChange, onNext, onBack }) {
  const set = (key) => (v) => onChange({ [key]: v })

  const rankedin = rangeError(value.rankedin, 0, 8)
  const playtomic = rangeError(value.playtomic, 0, 7)
  const padellink = rangeError(value.padellink, 0, 8)
  const years = rangeError(value.yearsPlaying, 0, 60, { integer: true })

  const ratingsValid =
    !rankedin.err && !playtomic.err && !padellink.err

  const canContinue =
    ratingsValid &&
    !!value.level &&
    !!value.playFrequency &&
    years.ok &&
    !!value.dominantHand &&
    !!value.preferredSide

  return (
    <>
      <StepHeader
        eyebrow="Step 3 · Your level"
        title="Where do you sit on the court?"
        subtitle="Coaches use this to suggest the right kind of session — be honest, not modest."
      />

      <div className="space-y-7">
        <section>
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
            <span aria-hidden className="h-1 w-1 rounded-full bg-secondary-container" />
            Official ratings
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldGroup label="Rankedin" hint="0–8" error={rankedin.err}>
              <TextInput
                value={value.rankedin}
                onChange={set('rankedin')}
                placeholder="4.25"
                inputMode="decimal"
              />
            </FieldGroup>
            <FieldGroup label="Playtomic" hint="0–7" error={playtomic.err}>
              <TextInput
                value={value.playtomic}
                onChange={set('playtomic')}
                placeholder="3.50"
                inputMode="decimal"
              />
            </FieldGroup>
            <FieldGroup label="Padel Link" hint="0–8" error={padellink.err}>
              <TextInput
                value={value.padellink}
                onChange={set('padellink')}
                placeholder="4.00"
                inputMode="decimal"
              />
            </FieldGroup>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-on-surface-variant/85">
            Got at least one? We use them to match you with the right level.
          </p>
        </section>

        <FieldGroup label="Self-assessed level" required>
          <RadioRow
            options={LEVEL_OPTIONS}
            value={value.level}
            onChange={set('level')}
            columns={2}
          />
        </FieldGroup>

        <FieldGroup label="How often do you play?" required>
          <RadioRow
            options={FREQ_OPTIONS}
            value={value.playFrequency}
            onChange={set('playFrequency')}
            columns={2}
          />
        </FieldGroup>

        <FieldGroup label="Years playing" required error={years.err}>
          <TextInput
            value={value.yearsPlaying}
            onChange={set('yearsPlaying')}
            placeholder="3"
            inputMode="numeric"
          />
        </FieldGroup>

        <FieldGroup label="Dominant hand" required>
          <RadioRow
            options={HAND_OPTIONS}
            value={value.dominantHand}
            onChange={set('dominantHand')}
            columns={3}
          />
        </FieldGroup>

        <FieldGroup label="Preferred side" required>
          <RadioRow
            options={SIDE_OPTIONS}
            value={value.preferredSide}
            onChange={set('preferredSide')}
            columns={3}
          />
        </FieldGroup>
      </div>

      <StepFooter canContinue={canContinue} onNext={onNext} onBack={onBack} />
    </>
  )
}
