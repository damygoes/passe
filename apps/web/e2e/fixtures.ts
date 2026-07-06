import { createClerkClient } from '@clerk/backend'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test as base, type Page } from '@playwright/test'

interface Fixtures {
  signedInPage: Page
}

const E2E_EMAIL = process.env.E2E_CLERK_TEST_EMAIL!
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

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

      // Driving the real sign-in form hits Clerk's "needs_client_trust" email-OTP step on a
      // brand-new test user's very first sign-in — testing tokens bypass bot detection, but not
      // that device-trust check, and there's no real inbox here to read the code from. Clerk's
      // documented workaround for exactly this is a server-issued sign-in token, consumed via
      // the frontend SDK. See https://clerk.com/docs/testing/playwright/overview.
      const [user] = (await clerkClient.users.getUserList({ emailAddress: [E2E_EMAIL] })).data
      if (!user) {
        throw new Error(`No Clerk user for ${E2E_EMAIL} — did e2e/global-setup.ts run?`)
      }
      const signInToken = await clerkClient.signInTokens.createSignInToken({
        userId: user.id,
        expiresInSeconds: 60,
      })

      // `/en` is a public route (proxy.ts redirects unauthenticated requests away from
      // everything else before Clerk's client JS — which runs the ticket exchange — ever
      // loads), and it's inside app/[locale]/layout.tsx's ClerkProvider so window.Clerk is
      // available here.
      await page.goto('/en')
      await page.waitForFunction(() => (window as unknown as { Clerk?: { loaded?: boolean } }).Clerk?.loaded)

      const signedIn = await page.evaluate(async (ticket) => {
        const clerk = (
          window as unknown as {
            Clerk: {
              client: {
                signIn: {
                  create: (params: {
                    strategy: 'ticket'
                    ticket: string
                  }) => Promise<{ status: string; createdSessionId: string }>
                }
              }
              setActive: (params: { session: string }) => Promise<void>
            }
          }
        ).Clerk
        const signIn = await clerk.client.signIn.create({ strategy: 'ticket', ticket })
        if (signIn.status !== 'complete') return false
        await clerk.setActive({ session: signIn.createdSessionId })
        return true
      }, signInToken.token)

      if (!signedIn) {
        throw new Error('Ticket sign-in did not complete — the sign-in token may have expired.')
      }

      await page.goto('/en/dashboard')
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
