import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/atelier.la.grace/',
  plugins: [
    react()
  ],
  server: {
    host: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
})
