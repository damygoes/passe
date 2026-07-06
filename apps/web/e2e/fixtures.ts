import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test as base, type Page } from '@playwright/test'

interface Fixtures {
  signedInPage: Page
}

const E2E_EMAIL = process.env.E2E_CLERK_TEST_EMAIL!
const E2E_PASSWORD = process.env.E2E_CLERK_TEST_PASSWORD!

// One real sign-in per worker (not per test) — subsequent tests in the same worker reuse the
// authenticated browser context via storageState, so the suite doesn't hit Clerk's real sign-in
// flow for every single test.
export const test = base.extend<Fixtures, { workerStorageState: string }>({
  // Playwright fixture callbacks receive a `use` continuation as their second argument — named
  // `runTest` here (instead of Playwright's own `use` convention) so eslint-plugin-react-hooks
  // doesn't mistake it for React 19's `use()` hook, which triggers rules-of-hooks false positives
  // on a plain function whose name happens to match.
  workerStorageState: [
    async ({ browser }, runTest) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      await setupClerkTestingToken({ page })

      await page.goto('/en/sign-in')
      await page.getByLabel('Email').fill(E2E_EMAIL)
      await page.getByLabel('Password', { exact: true }).fill(E2E_PASSWORD)
      await page.getByRole('button', { name: 'Sign in' }).click()
      await page.waitForURL('**/dashboard')

      const storageState = await context.storageState()
      await context.close()
      await runTest(JSON.stringify(storageState))
    },
    { scope: 'worker' },
  ],

  signedInPage: async ({ browser, workerStorageState }, runTest) => {
    const context = await browser.newContext({ storageState: JSON.parse(workerStorageState) })
    const page = await context.newPage()
    await setupClerkTestingToken({ page })
    await runTest(page)
    await context.close()
  },
})

export { expect } from '@playwright/test'
