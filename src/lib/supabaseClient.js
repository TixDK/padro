import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  // Make the dev-time failure obvious instead of a silent broken auth flow.
  // eslint-disable-next-line no-console
  console.error(
    '[padro] Missing Supabase env vars. Copy .env.example to .env.local and fill in both values.',
  )
}

export const supabase = createClient(url ?? '', key ?? '', {
  auth: {
    // Keep the session in localStorage so it survives reloads.
    persistSession: true,
    autoRefreshToken: true,
    // Lets supabase-js auto-handle the ?code=... query string when Google
    // redirects the user back to the app.
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
