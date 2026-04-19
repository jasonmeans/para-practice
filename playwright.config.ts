import { defineConfig } from '@playwright/test'

const PORT = 3100

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node server/index.mjs',
    url: `http://127.0.0.1:${PORT}/api/health`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      HOST: '127.0.0.1',
      PORT: String(PORT),
      DATA_FILE: '.tmp/playwright-store.json',
    },
  },
})
