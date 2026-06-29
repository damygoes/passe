import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { ClerkWebhookEvent } from '@passe/auth/types'
import { syncClerkUser } from '@passe/auth/webhook'
import { createLogger } from '@passe/logger'
import type { NextRequest } from 'next/server'

const log = createLogger({ context: { module: 'webhook' } })

export async function POST(req: NextRequest) {
  let event
  try {
    event = await verifyWebhook(req, { signingSecret: process.env.CLERK_WEBHOOK_SECRET })
  } catch (err) {
    log.error('Webhook verification failed', { error: err instanceof Error ? err.message : String(err) })
    return new Response('Unauthorized', { status: 400 })
  }

  if (
    event.type === 'user.created' ||
    event.type === 'user.updated' ||
    event.type === 'user.deleted'
  ) {
    try {
      await syncClerkUser(event as unknown as ClerkWebhookEvent)
    } catch (err) {
      log.error('Webhook sync failed', { error: err instanceof Error ? err.message : String(err) })
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}
