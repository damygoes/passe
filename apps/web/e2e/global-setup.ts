import { clerkSetup } from '@clerk/testing/playwright'
import { createClerkClient } from '@clerk/backend'
import { db } from '@passe/db/client'
import { trips, users } from '@passe/db/schema'
import { eq } from 'drizzle-orm'

const E2E_USERNAME = 'e2e-test-user'

// Runs once in Node before any test, against the real dev Clerk instance + dev database
// configured in .env.local. Provisions the dedicated e2e test user idempotently so a fresh
// checkout can run the suite without a manual setup step.
//
// Clerk's user.created webhook (which normally creates the corresponding `users` row) can't
// reach a local dev server, so this upserts that row directly instead of waiting on it.
export default async function globalSetup() {
  await clerkSetup()

  const email = process.env.E2E_CLERK_TEST_EMAIL
  const password = process.env.E2E_CLERK_TEST_PASSWORD
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!email || !password) {
    throw new Error(
      'E2E_CLERK_TEST_EMAIL and E2E_CLERK_TEST_PASSWORD must be set in apps/web/.env.local to run e2e tests. See .env.local.example.',
    )
  }
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY must be set in apps/web/.env.local to run e2e tests.')
  }

  const clerkClient = createClerkClient({ secretKey })

  const existingClerkUsers = await clerkClient.users.getUserList({ emailAddress: [email] })
  let clerkUserId = existingClerkUsers.data[0]?.id

  if (!clerkUserId) {
    const created = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName: 'E2E',
      lastName: 'Test',
      skipPasswordChecks: true,
    })
    clerkUserId = created.id
  }

  await db
    .insert(users)
    .values({
      id: clerkUserId,
      email,
      username: E2E_USERNAME,
      displayName: 'E2E Test',
      plan: 'free',
    })
    .onConflictDoNothing({ target: users.id })

  // Sweep trips leaked by earlier failed runs. The trip-flow test only deletes its trip in its
  // final step, so any failure before that leaks one trip per attempt — and once the free plan's
  // maxTrips (3) is reached, "Create trip" is disabled and the whole suite fails deterministically
  // until someone cleans the dev DB by hand. Memories and media cascade on trip delete.
  await db.delete(trips).where(eq(trips.userId, clerkUserId))
}
