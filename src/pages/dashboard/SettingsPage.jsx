import { PlaceholderSection } from './_placeholder'

const ROWS = [
  { label: 'Email notifications', hint: 'Match reminders, payment receipts.' },
  { label: 'Calendar sync', hint: 'Push Padro sessions to your Google calendar.' },
  { label: 'Language', hint: 'Currently English by default.' },
  { label: 'Delete account', hint: 'Removes profile, bookings, and history.' },
]

export function SettingsPage() {
  return (
    <div className="space-y-10">
      <PlaceholderSection
        eyebrow="Settings"
        title="Knobs and dials."
        subtitle="Toggles light up as we ship the underlying features."
      />

      <section className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_18px_50px_-30px_rgba(0,31,17,0.08)]">
        <ul>
          {ROWS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4 last:border-b-0 md:px-6"
            >
              <div className="min-w-0">
                <p className="truncate font-serif text-[15px] text-primary">
                  {row.label}
                </p>
                <p className="truncate text-[12px] text-on-surface-variant">
                  {row.hint}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                Coming soon
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
