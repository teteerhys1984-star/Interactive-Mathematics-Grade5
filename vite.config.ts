import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Interactive-Mathematics-Grade5/',
  plugins: [react()],
  server: { host: '0.0.0.0', allowedHosts: true },
})
