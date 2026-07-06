import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Playwright runs global-setup.ts, fixtures.ts, and spec files as plain Node — none of that
// gets Next.js's automatic .env.local loading, so replicate it explicitly before anything else
// in this process reads process.env (CLERK_SECRET_KEY, DATABASE_URL, E2E_CLERK_TEST_*, ...).
//
// Deliberately NOT using @next/env's loadEnvConfig() here: it mirrors Next.js's env cascade,
// which — by design — skips .env.local entirely when NODE_ENV is "test". Playwright sets
// NODE_ENV=test automatically, so that call silently loaded nothing. Load .env.local directly
// and unconditionally instead, since that's the one file with the real dev credentials this
// suite needs.
config({ path: path.join(dirname, '.env.local') })

// Real dev Clerk instance + dev Neon branch — see e2e/global-setup.ts and .env.local.example
// for the E2E_CLERK_TEST_EMAIL/E2E_CLERK_TEST_PASSWORD this needs.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
