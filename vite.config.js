import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pinned so it matches Google OAuth + Supabase redirect URLs.
    port: 3000,
    strictPort: true,
  },
})
