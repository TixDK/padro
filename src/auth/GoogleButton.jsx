import { motion } from 'framer-motion'

const SOFT_HOVER = {
  whileHover: { y: -1 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { type: 'spring', stiffness: 380, damping: 26 },
}

/**
 * Single-line Google sign-in button styled in the IG / Meta tradition:
 * compact, single typographic statement, brand-mark on the left.
 */
export function GoogleButton({
  onClick,
  loading = false,
  disabled = false,
  label = 'Continue with Google',
  loadingLabel = 'Signing you in…',
}) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...(isDisabled ? {} : SOFT_HOVER)}
      className="group relative inline-flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-hairline bg-white px-4 py-3 text-[15px] font-medium text-primary shadow-[0_2px_0_0_rgba(0,31,17,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_6px_18px_-10px_rgba(0,31,17,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-hairline disabled:hover:shadow-[0_2px_0_0_rgba(0,31,17,0.04)]"
    >
      {loading ? <Spinner /> : <GoogleMark />}
      <span>{loading ? loadingLabel : label}</span>
    </motion.button>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 animate-spin text-primary"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
