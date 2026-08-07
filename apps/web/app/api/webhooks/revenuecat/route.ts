import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import type { Plan } from '@passe/types'
import { timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'webhooks/revenuecat' } })

// Events that grant or renew access. Plan comes from event.entitlement_ids, which are 1:1 with
// our planEnum values by convention (configured that way in the RevenueCat dashboard).
const GRANT_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'TRANSFER',
  'BILLING_ISSUE',
])
// Only EXPIRATION means access has actually ended — mirrors Stripe's
// customer.subscription.deleted. CANCELLATION alone just means auto-renew was turned off;
// RevenueCat (and the underlying store) keeps the entitlement active until the paid period ends.
const REVOKE_EVENTS = new Set(['EXPIRATION'])
// Deliberately not handled: CANCELLATION (see above), TEST, SUBSCRIBER_ALIAS.

type RevenueCatEvent = {
  type: string
  app_user_id: string
  entitlement_ids?: string[]
  environment?: string
}

function verifyAuth(req: Request): boolean {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET
  if (!secret) return false

  const header = req.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  const received = Buffer.from(header)
  const wanted = Buffer.from(expected)
  // Buffers of different lengths would throw inside timingSafeEqual
  if (received.length !== wanted.length) return false
  return timingSafeEqual(received, wanted)
}

function resolvePlan(entitlementIds: string[]): Plan | null {
  if (entitlementIds.includes('collector')) return 'collector'
  if (entitlementIds.includes('explorer')) return 'explorer'
  return null
}

// POST /api/webhooks/revenuecat — updates users.plan/planSource from mobile IAP events.
// This mirrors /api/webhooks/stripe: users.plan stays the single source of truth read by both
// web and mobile, now written by two independent purchase sources instead of one.
export async function POST(req: Request) {
  if (!verifyAuth(req)) {
    log.error('Missing or invalid RevenueCat webhook auth')
    return new Response('Unauthorized', { status: 401 })
  }

  let event: RevenueCatEvent
  try {
    const body = (await req.json()) as { event: RevenueCatEvent }
    event = body.event
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  if (!GRANT_EVENTS.has(event.type) && !REVOKE_EVENTS.has(event.type)) {
    return new Response('OK', { status: 200 })
  }

  // appUserID is set to the Clerk user ID at Purchases.configure() time on mobile, so it
  // resolves straight to our primary key — no customer-ID mapping table needed, unlike Stripe.
  const user = await db.query.users.findFirst({ where: eq(users.id, event.app_user_id) })
  if (!user) {
    // User may have deleted their account between subscribing and this event —
    // acknowledge so RevenueCat stops retrying
    log.error('No user for RevenueCat app_user_id', {
      appUserId: event.app_user_id,
      eventType: event.type,
    })
    return new Response('OK', { status: 200 })
  }

  const plan: Plan | null = REVOKE_EVENTS.has(event.type)
    ? 'free'
    : resolvePlan(event.entitlement_ids ?? [])

  if (plan === null) {
    log.error('Grant event with no recognized entitlement', {
      userId: user.id,
      eventType: event.type,
      entitlementIds: event.entitlement_ids,
    })
    return new Response('OK', { status: 200 })
  }

  const planSource = plan === 'free' ? null : 'revenuecat'

  if (user.plan !== plan || user.planSource !== planSource) {
    try {
      await db.update(users).set({ plan, planSource }).where(eq(users.id, user.id))
    } catch (err) {
      log.error('DB write failed', {
        userId: user.id,
        error: err instanceof Error ? err.message : String(err),
      })
      return new Response('Internal Server Error', { status: 500 })
    }
    log.debug('Updated plan from RevenueCat event', {
      userId: user.id,
      plan,
      eventType: event.type,
      environment: event.environment,
    })
  }

  return new Response('OK', { status: 200 })
}
