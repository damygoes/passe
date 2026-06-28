import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { ClerkWebhookEvent } from '@passe/auth/types'
import { syncClerkUser } from '@passe/auth/webhook'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  let event
  try {
    event = await verifyWebhook(req, { signingSecret: process.env.CLERK_WEBHOOK_SECRET })
  } catch (err) {
    console.error('[webhook] verification failed:', err)
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
      console.error('[webhook] syncClerkUser failed:', err)
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}
