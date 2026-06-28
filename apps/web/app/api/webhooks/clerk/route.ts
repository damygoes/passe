import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { ClerkWebhookEvent } from '@passe/auth/types'
import { syncClerkUser } from '@passe/auth/webhook'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const event = await verifyWebhook(req)

  if (
    event.type === 'user.created' ||
    event.type === 'user.updated' ||
    event.type === 'user.deleted'
  ) {
    await syncClerkUser(event as unknown as ClerkWebhookEvent)
  }

  return new Response('OK', { status: 200 })
}
