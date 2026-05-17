import {
  StepHeader,
  FieldGroup,
  TextInput,
  StepFooter,
} from './_components'

const PHONE_RE = /^\+?[0-9\s-]{6,20}$/

export function StepIdentity({ value, onChange, onNext, onBack }) {
  const set = (key) => (v) => onChange({ [key]: v })

  const trimmedName = (value.displayName || '').trim()
  const nameOk = trimmedName.length >= 1 && trimmedName.length <= 80
  const nameErr =
    trimmedName.length === 0
      ? null
      : !nameOk
        ? 'Between 1 and 80 characters.'
        : null

  const phoneTrim = (value.phone || '').trim()
  const phoneOk = phoneTrim === '' || PHONE_RE.test(phoneTrim)
  const phoneErr = !phoneOk
    ? 'Use digits, spaces, or hyphens. Optional + prefix.'
    : null

  const canContinue = nameOk && phoneOk

  return (
    <>
      <StepHeader
        eyebrow="Step 2 · Identity"
        title="Tell us a little about you."
        subtitle="We use this to introduce you to coaches (or players, if you're coaching)."
      />

      <div className="space-y-5">
        <FieldGroup label="Display name" required error={nameErr}>
          <TextInput
            value={value.displayName}
            onChange={set('displayName')}
            placeholder="How you want to be addressed"
            maxLength={80}
            autoFocus
          />
        </FieldGroup>

        <FieldGroup label="City">
          <TextInput
            value={value.city}
            onChange={set('city')}
            placeholder="København, Aarhus, Odense…"
            maxLength={80}
          />
        </FieldGroup>

        <FieldGroup
          label="Phone"
          hint="Optional"
          error={phoneErr}
        >
          <TextInput
            value={value.phone}
            onChange={set('phone')}
            placeholder="+45 12 34 56 78"
            type="tel"
            inputMode="tel"
          />
        </FieldGroup>
      </div>

      <StepFooter
        canContinue={canContinue}
        onNext={onNext}
        onBack={onBack}
      />
    </>
  )
}
