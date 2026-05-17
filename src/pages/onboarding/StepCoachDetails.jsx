import { useState } from 'react'
import {
  StepHeader,
  FieldGroup,
  TextInput,
  TextArea,
  Chip,
  StepFooter,
} from './_components'

const LANGUAGES = [
  { value: 'da', label: 'Dansk' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'sv', label: 'Svenska' },
  { value: 'no', label: 'Norsk' },
  { value: 'de', label: 'Deutsch' },
]

const SPECIALTY_PRESETS = [
  'smash',
  'defense',
  'kamp-forberedelse',
  'begynder',
  'viderekomne',
  'fysisk-træning',
]

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

export function StepCoachDetails({ value, onChange, onNext, onBack }) {
  const set = (key) => (v) => onChange({ [key]: v })
  const [specialtyDraft, setSpecialtyDraft] = useState('')

  const headline = (value.headline || '').trim()
  const headlineLen = headline.length
  const headlineErr =
    headlineLen === 0
      ? null
      : headlineLen < 5
        ? 'At least 5 characters.'
        : headlineLen > 120
          ? 'Keep it under 120 characters.'
          : null
  const headlineOk = headlineLen >= 5 && headlineLen <= 120

  const rateRaw = (value.hourlyRate || '').trim()
  const rateNum = Number(rateRaw)
  const rateOk =
    rateRaw !== '' && Number.isFinite(rateNum) && rateNum >= 100 && rateNum <= 5000
  const rateErr =
    rateRaw === ''
      ? null
      : !Number.isFinite(rateNum)
        ? 'Numbers only.'
        : rateNum < 100
          ? 'Minimum 100 DKK.'
          : rateNum > 5000
            ? 'Maximum 5000 DKK.'
            : null

  const yearsRaw = (value.experienceYears || '').trim()
  const yearsNum = Number(yearsRaw)
  const yearsOk =
    yearsRaw === '' ||
    (Number.isFinite(yearsNum) &&
      Number.isInteger(yearsNum) &&
      yearsNum >= 0 &&
      yearsNum <= 60)
  const yearsErr =
    yearsRaw === ''
      ? null
      : !Number.isFinite(yearsNum)
        ? 'Numbers only.'
        : !Number.isInteger(yearsNum)
          ? 'Whole numbers only.'
          : yearsNum < 0 || yearsNum > 60
            ? 'Between 0 and 60.'
            : null

  const bioOk = (value.bio || '').length <= 1000
  const languagesOk = value.languages.length > 0

  const canContinue =
    headlineOk && rateOk && yearsOk && bioOk && languagesOk

  const addSpecialty = () => {
    const v = specialtyDraft.trim().toLowerCase()
    if (!v || value.specialties.includes(v)) {
      setSpecialtyDraft('')
      return
    }
    set('specialties')([...value.specialties, v])
    setSpecialtyDraft('')
  }

  const customSpecialties = value.specialties.filter(
    (s) => !SPECIALTY_PRESETS.includes(s),
  )

  return (
    <>
      <StepHeader
        eyebrow="Step 3 · Your coaching"
        title="How do you coach?"
        subtitle="This is what players see on your profile. You can refine it any time."
      />

      <div className="space-y-6">
        <FieldGroup
          label="Headline"
          required
          error={headlineErr}
          hint={`${headlineLen}/120`}
        >
          <TextInput
            value={value.headline}
            onChange={set('headline')}
            placeholder="Padel-træner med 8 års turneringserfaring"
            maxLength={120}
          />
        </FieldGroup>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldGroup
            label="Hourly rate (DKK)"
            required
            error={rateErr}
            hint="100–5000"
          >
            <TextInput
              value={value.hourlyRate}
              onChange={set('hourlyRate')}
              placeholder="450"
              inputMode="numeric"
            />
          </FieldGroup>

          <FieldGroup
            label="Years of experience"
            error={yearsErr}
            hint="Optional"
          >
            <TextInput
              value={value.experienceYears}
              onChange={set('experienceYears')}
              placeholder="8"
              inputMode="numeric"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Languages" required>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip
                key={l.value}
                selected={value.languages.includes(l.value)}
                onClick={() => set('languages')(toggle(value.languages, l.value))}
              >
                {l.label}
              </Chip>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Specialties" hint="Optional">
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_PRESETS.map((s) => (
              <Chip
                key={s}
                selected={value.specialties.includes(s)}
                onClick={() => set('specialties')(toggle(value.specialties, s))}
              >
                {s}
              </Chip>
            ))}
            {customSpecialties.map((s) => (
              <Chip
                key={s}
                selected
                onClick={() =>
                  set('specialties')(value.specialties.filter((x) => x !== s))
                }
              >
                {s}
              </Chip>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <TextInput
              value={specialtyDraft}
              onChange={setSpecialtyDraft}
              placeholder="Add a custom specialty"
            />
            <button
              type="button"
              disabled={!specialtyDraft.trim()}
              onClick={addSpecialty}
              className="shrink-0 cursor-pointer rounded-xl border border-hairline bg-white px-4 py-3 text-label-md font-medium text-primary transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </FieldGroup>

        <FieldGroup
          label="Bio"
          hint={`${(value.bio || '').length}/1000`}
          error={bioOk ? null : 'Keep it under 1000 characters.'}
        >
          <TextArea
            value={value.bio}
            onChange={set('bio')}
            placeholder="A few sentences about how you coach, your style, what kind of players you love working with."
            rows={5}
            maxLength={1000}
          />
        </FieldGroup>
      </div>

      <StepFooter canContinue={canContinue} onNext={onNext} onBack={onBack} />
    </>
  )
}
