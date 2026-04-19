import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

const repoBase = '/para-practice/'

export default defineConfig(({ mode }) => ({
  base:
    mode === 'production' && process.env.BUILD_TARGET === 'pages'
      ? repoBase
      : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
}))
