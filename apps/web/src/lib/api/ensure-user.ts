import { clerkClient } from '@clerk/nextjs/server'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { DrizzleQueryError, eq, or } from 'drizzle-orm'

const log = createLogger({ context: { module: 'ensure-user' } })

// email/username collide with a UNIQUE constraint whose values always come fresh from Clerk
// (which itself enforces email uniqueness) — a conflict under a different `id` can only be a
// row left behind by a Clerk user that was deleted outside the app's own delete flow (e.g.
// directly in the Clerk dashboard, bypassing the `user.deleted` webhook cleanup).
function staleUniqueConstraint(err: unknown): boolean {
  if (!(err instanceof DrizzleQueryError)) return false
  const cause = err.cause as { code?: string; constraint?: string } | undefined
  return (
    cause?.code === '23505' &&
    (cause.constraint === 'users_email_unique' || cause.constraint === 'users_username_unique')
  )
}

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
    const username = user.username ?? user.id
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || username

    const values = { id: user.id, email, username, displayName, avatarUrl: user.imageUrl || null }

    try {
      await db.insert(users).values(values).onConflictDoNothing({ target: users.id })
    } catch (err) {
      if (!staleUniqueConstraint(err)) throw err
      log.error('Deleting stale user row blocking backfill', { userId, email, username })
      await db.delete(users).where(or(eq(users.email, email), eq(users.username, username)))
      await db.insert(users).values(values).onConflictDoNothing({ target: users.id })
    }
  } catch (err) {
    log.error('Failed to backfill user row', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
