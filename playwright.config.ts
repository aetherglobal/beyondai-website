import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

import { assertTestDatabase } from './tests/helpers/assertTestDatabase'

dotenv.config({ path: 'test.env', override: !process.env.CI })
dotenv.config()

assertTestDatabase('E2E config')

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/globalSetup.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'bun dev',
    reuseExistingServer: false,
    url: 'http://localhost:3000',
    timeout: 180_000,
    env: { DATABASE_URL: process.env.DATABASE_URL as string },
  },
})
