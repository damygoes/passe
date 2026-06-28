import { db } from '@passe/db/client'
import { users } from '@passe/db/schema'
import { eq } from 'drizzle-orm'
import type { ClerkWebhookEvent, ClerkWebhookUser } from './types'

export async function syncClerkUser(event: ClerkWebhookEvent): Promise<void> {
  if (event.type === 'user.deleted') {
    await db.delete(users).where(eq(users.id, event.data.id))
    return
  }

  const u: ClerkWebhookUser = event.data
  const email =
    u.email_addresses.find((e) => e.id === u.primary_email_address_id)?.email_address ?? ''
  const displayName =
    [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || u.id

  await db
    .insert(users)
    .values({
      id: u.id,
      email,
      username: u.username ?? u.id,
      displayName,
      avatarUrl: u.image_url || null,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email,
        displayName,
        avatarUrl: u.image_url || null,
      },
    })
}
