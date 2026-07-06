import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { getStripe } from '@/lib/stripe'
import type { ClerkWebhookEvent } from '@passe/auth/types'
import { syncClerkUser } from '@passe/auth/webhook'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'

const log = createLogger({ context: { module: 'webhook' } })

// Deleting the Stripe customer cancels its subscriptions immediately —
// without this, deleted accounts would keep getting charged. Must run
// before syncClerkUser, which removes the users row holding the customer ID.
async function cancelStripeBilling(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user?.stripeCustomerId) return

  try {
    await getStripe().customers.del(user.stripeCustomerId)
  } catch (err) {
    // Don't block the user deletion — log loudly so the orphaned
    // subscription can be cancelled manually in the Stripe dashboard
    log.error('Failed to delete Stripe customer for deleted user', {
      userId,
      stripeCustomerId: user.stripeCustomerId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export async function POST(req: NextRequest) {
  let event
  try {
    event = await verifyWebhook(req, { signingSecret: process.env.CLERK_WEBHOOK_SECRET })
  } catch (err) {
    log.error('Webhook verification failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return new Response('Unauthorized', { status: 400 })
  }

  if (
    event.type === 'user.created' ||
    event.type === 'user.updated' ||
    event.type === 'user.deleted'
  ) {
    try {
      if (event.type === 'user.deleted' && event.data.id) {
        await cancelStripeBilling(event.data.id)
      }
      await syncClerkUser(event as unknown as ClerkWebhookEvent)
    } catch (err) {
      log.error('Webhook sync failed', { error: err instanceof Error ? err.message : String(err) })
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}
