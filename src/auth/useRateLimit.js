import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sliding-window client-side rate limiter.
 *
 * Why client-side: prevents accidental button-mashing, double-fires, and
 * runaway loops from one user's session. It is NOT a substitute for
 * server-side rate limiting — Google's identity endpoints have their own,
 * and any real backend should enforce its own quota.
 */
export function useRateLimit({
  max = 4,
  windowMs = 30_000,
  cooldownMs = 60_000,
  storageKey,
} = {}) {
  const attemptsRef = useRef([])
  const [lockedUntil, setLockedUntil] = useState(0)
  const [remainingMs, setRemainingMs] = useState(0)

  // Restore persisted lock across reloads if asked.
  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed?.lockedUntil && parsed.lockedUntil > Date.now()) {
        setLockedUntil(parsed.lockedUntil)
      }
      if (Array.isArray(parsed?.attempts)) {
        attemptsRef.current = parsed.attempts.filter(
          (t) => Date.now() - t < windowMs,
        )
      }
    } catch {
      /* ignore */
    }
  }, [storageKey, windowMs])

  // Live countdown when locked.
  useEffect(() => {
    if (lockedUntil === 0) return
    const tick = () => {
      const remaining = lockedUntil - Date.now()
      if (remaining <= 0) {
        setLockedUntil(0)
        setRemainingMs(0)
        attemptsRef.current = []
        if (storageKey) sessionStorage.removeItem(storageKey)
      } else {
        setRemainingMs(remaining)
      }
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [lockedUntil, storageKey])

  const persist = useCallback(() => {
    if (!storageKey) return
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          attempts: attemptsRef.current,
          lockedUntil,
        }),
      )
    } catch {
      /* ignore */
    }
  }, [storageKey, lockedUntil])

  const attempt = useCallback(() => {
    const now = Date.now()
    if (lockedUntil > now) {
      return { allowed: false, remainingMs: lockedUntil - now }
    }

    attemptsRef.current = attemptsRef.current.filter(
      (t) => now - t < windowMs,
    )

    if (attemptsRef.current.length >= max) {
      const lock = now + cooldownMs
      setLockedUntil(lock)
      setRemainingMs(cooldownMs)
      persist()
      return { allowed: false, remainingMs: cooldownMs }
    }

    attemptsRef.current.push(now)
    persist()
    return { allowed: true }
  }, [lockedUntil, max, windowMs, cooldownMs, persist])

  const reset = useCallback(() => {
    attemptsRef.current = []
    setLockedUntil(0)
    setRemainingMs(0)
    if (storageKey) sessionStorage.removeItem(storageKey)
  }, [storageKey])

  return {
    attempt,
    reset,
    locked: lockedUntil > 0,
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    attemptsUsed: attemptsRef.current.length,
    max,
  }
}
