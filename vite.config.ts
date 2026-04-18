import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/para-practice/'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? repoBase : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
}))
