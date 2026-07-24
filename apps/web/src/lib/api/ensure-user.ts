import { clerkClient } from '@clerk/nextjs/server'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'ensure-user' } })

// The Clerk webhook (@passe/auth/webhook) is the source of truth for keeping `users` in sync,
// but its delivery isn't guaranteed to land before a brand new user's first authenticated
// request — e.g. local dev has no public endpoint for Clerk to call. Backfill the row here so a
// new sign-up (OAuth or password) never hits a missing-user 404 on its first request.
export async function ensureUserExists(userId: string): Promise<void> {
  const existing = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (existing) return

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const email =
      user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)
        ?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ''
    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.id

    await db
      .insert(users)
      .values({
        id: user.id,
        email,
        username: user.username ?? user.id,
        displayName,
        avatarUrl: user.imageUrl || null,
      })
      .onConflictDoNothing({ target: users.id })
  } catch (err) {
    log.error('Failed to backfill user row', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
