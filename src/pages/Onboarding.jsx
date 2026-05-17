import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import {
  updateProfile,
  upsertTrainer,
  upsertPlayerRatings,
  setTrainerVenues,
} from '../lib/profile'
import { ProgressBar } from './onboarding/ProgressBar'
import { StepRole } from './onboarding/StepRole'
import { StepIdentity } from './onboarding/StepIdentity'
import { StepPlayerDetails } from './onboarding/StepPlayerDetails'
import { StepCoachDetails } from './onboarding/StepCoachDetails'
import { StepVenues } from './onboarding/StepVenues'
import { StepSummary } from './onboarding/StepSummary'
import padroLogo from '../assets/padro.png'

// Storage keys are user-scoped so that a sign-out → sign-in-as-someone-else
// cycle in the same tab can't pick up the previous user's half-finished answers.
const stateKey = (uid) => `padro:onboarding:state:${uid}`
const stepKey = (uid) => `padro:onboarding:step:${uid}`

const TOTAL_STEPS = 5

const INITIAL_STATE = {
  role: null,
  displayName: '',
  city: '',
  phone: '',
  // player branch
  rankedin: '',
  playtomic: '',
  padellink: '',
  level: null,
  playFrequency: null,
  yearsPlaying: '',
  dominantHand: null,
  preferredSide: null,
  // coach branch
  headline: '',
  hourlyRate: '',
  experienceYears: '',
  languages: ['da'],
  specialties: [],
  bio: '',
  // both
  venueIds: [],
}

const STEP_LABELS = {
  1: 'Role',
  2: 'Identity',
  3: 'Profile',
  4: 'Venues',
  5: 'Confirm',
}

function loadState(uid) {
  try {
    const raw = sessionStorage.getItem(stateKey(uid))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadStep(uid) {
  try {
    const n = Number(sessionStorage.getItem(stepKey(uid)))
    return Number.isFinite(n) && n >= 1 && n <= TOTAL_STEPS ? n : 1
  } catch {
    return 1
  }
}

export function Onboarding() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()

  // user is guaranteed by <RequireAuth>, but defensively fall back.
  const uid = user?.id || 'anon'

  const [state, setState] = useState(() => {
    const stored = loadState(uid)
    if (stored) return { ...INITIAL_STATE, ...stored }
    return {
      ...INITIAL_STATE,
      // Prefill from the row that handle_new_user already created.
      displayName:
        profile?.display_name || user?.givenName || user?.name || '',
      city: profile?.city || '',
    }
  })
  const [step, setStep] = useState(() => loadStep(uid))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(stateKey(uid), JSON.stringify(state))
    } catch {
      // Quota or disabled storage — silently degrade, refresh just loses state.
    }
  }, [state, uid])

  useEffect(() => {
    try {
      sessionStorage.setItem(stepKey(uid), String(step))
    } catch {
      // see above
    }
  }, [step, uid])

  const patch = useCallback((p) => {
    setState((s) => ({ ...s, ...p }))
  }, [])

  const next = useCallback(
    () => setStep((s) => Math.min(s + 1, TOTAL_STEPS)),
    [],
  )
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])

  const clearStorage = () => {
    try {
      sessionStorage.removeItem(stateKey(uid))
      sessionStorage.removeItem(stepKey(uid))
    } catch {
      // Storage might be disabled or full; nothing to clear is fine.
    }
  }

  const handleSignOut = async () => {
    clearStorage()
    await signOut()
    navigate('/', { replace: true })
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('Session expired — sign in again.')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const isCoach = state.role === 'trainer'
      const profilePatch = {
        role: state.role,
        display_name: state.displayName.trim(),
        city: state.city.trim() || null,
        phone: state.phone.trim() || null,
        level: isCoach ? null : state.level,
        bio: isCoach ? state.bio.trim() || null : null,
        preferred_venue_ids: isCoach ? [] : state.venueIds,
        onboarded_at: new Date().toISOString(),
      }

      const upd = await updateProfile(user.id, profilePatch)
      if (upd.error) throw upd.error

      if (isCoach) {
        const t = await upsertTrainer(user.id, {
          headline: state.headline.trim(),
          hourly_rate_dkk: Number(state.hourlyRate),
          languages: state.languages.length ? state.languages : ['da'],
          specialties: state.specialties,
          experience_years: state.experienceYears.trim()
            ? Number(state.experienceYears)
            : null,
        })
        if (t.error) throw t.error
        const v = await setTrainerVenues(user.id, state.venueIds)
        if (v.error) throw v.error
      } else {
        const r = await upsertPlayerRatings(user.id, {
          rankedin_rating: state.rankedin.trim()
            ? Number(state.rankedin)
            : null,
          playtomic_level: state.playtomic.trim()
            ? Number(state.playtomic)
            : null,
          padellink_rating: state.padellink.trim()
            ? Number(state.padellink)
            : null,
          play_frequency: state.playFrequency,
          years_playing: state.yearsPlaying.trim()
            ? Number(state.yearsPlaying)
            : null,
          dominant_hand: state.dominantHand,
          preferred_side: state.preferredSide,
        })
        if (r.error) throw r.error
      }

      clearStorage()
      await refreshProfile()
      navigate('/account', { replace: true })
    } catch (e) {
      setSubmitting(false)
      setError(e?.message || 'Something went wrong — try again.')
    }
  }

  const isCoach = state.role === 'trainer'

  // If sessionStorage was hand-edited / corrupted, never render a role-dependent
  // step before a role is picked — fall back to step 1.
  const visibleStep = step > 1 && !state.role ? 1 : step

  const renderStep = () => {
    switch (visibleStep) {
      case 1:
        return (
          <StepRole
            value={state.role}
            onChange={(role) => patch({ role })}
            onNext={next}
          />
        )
      case 2:
        return (
          <StepIdentity
            value={state}
            onChange={patch}
            onNext={next}
            onBack={back}
          />
        )
      case 3:
        return isCoach ? (
          <StepCoachDetails
            value={state}
            onChange={patch}
            onNext={next}
            onBack={back}
          />
        ) : (
          <StepPlayerDetails
            value={state}
            onChange={patch}
            onNext={next}
            onBack={back}
          />
        )
      case 4:
        return (
          <StepVenues
            value={state}
            onChange={patch}
            onNext={next}
            onBack={back}
            role={state.role}
          />
        )
      case 5:
        return (
          <StepSummary
            value={state}
            onSubmit={handleSubmit}
            onBack={back}
            loading={submitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface px-4 py-8 text-on-surface sm:py-14">
      {/* Warm wash, consistent with Login.jsx */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(254,147,44,0.06),transparent_70%)]"
      />

      {/* Top bar: logo + sign-out escape hatch */}
      <div className="relative mx-auto mb-6 flex w-full max-w-[640px] items-center justify-between sm:mb-8">
        <Link to="/" className="group inline-flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/[0.04] ring-1 ring-secondary-container/30 transition-all duration-300 group-hover:ring-secondary-container/70">
            <img
              src={padroLogo}
              alt="Padro"
              className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </span>
          <span className="font-serif text-[18px] font-semibold tracking-[-0.02em] text-primary">
            Padro
          </span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Sign out
        </button>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-[640px]"
      >
        {/* Sticky on small screens so the user always sees where they are */}
        <div className="sticky top-0 z-10 -mx-4 mb-3 bg-surface/95 px-4 pb-2 pt-3 backdrop-blur sm:static sm:mx-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <ProgressBar
            step={visibleStep}
            total={TOTAL_STEPS}
            label={STEP_LABELS[visibleStep]}
          />
        </div>

        <section className="rounded-2xl border border-hairline bg-white px-6 pb-8 pt-8 shadow-[0_18px_50px_-30px_rgba(0,31,17,0.18)] sm:px-10 sm:pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${visibleStep}-${state.role || 'none'}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              role="alert"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-2 rounded-xl border border-secondary-container/50 bg-secondary-container/10 px-3 py-2 text-[12px] leading-snug text-on-surface"
            >
              <svg
                viewBox="0 0 20 20"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary-container"
                fill="currentColor"
                aria-hidden
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
              </svg>
              <span>{error}</span>
            </motion.p>
          )}
        </section>

        <p className="mt-6 text-center text-[11px] text-on-surface-variant/70">
          Signed in as{' '}
          <span className="text-on-surface-variant">{user?.email}</span>
        </p>
      </motion.div>
    </main>
  )
}
