import { getStripe, priceIdToPlan } from '@/lib/billing/stripe'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import type { Plan } from '@passe/types'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

const log = createLogger({ context: { module: 'webhooks/stripe' } })

// Subscription lifecycle events are the single source of plan changes.
// checkout.session.completed is intentionally not handled — the
// customer.subscription.created event fires alongside it and already
// carries the price, so handling both would just duplicate writes.
const SUBSCRIPTION_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
] as const

function resolvePlan(subscription: Stripe.Subscription): Plan {
  if (subscription.status !== 'active' && subscription.status !== 'trialing') return 'free'
  const priceId = subscription.items.data[0]?.price.id
  if (!priceId) return 'free'
  return priceIdToPlan(priceId) ?? 'free'
}

// POST /api/webhooks/stripe — updates users.plan from subscription events.
// This column is the single source of truth read by both web and mobile.
export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) {
    log.error('Missing webhook signature or STRIPE_WEBHOOK_SECRET')
    return new Response('Unauthorized', { status: 400 })
  }

  let event: Stripe.Event
  try {
    // Signature is computed over the exact raw bytes — never parse before verifying
    const rawBody = await req.text()
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    log.error('Webhook verification failed', {
      error: err instanceof Error ? err.message : String(err),
    })
    return new Response('Unauthorized', { status: 400 })
  }

  if (!(SUBSCRIPTION_EVENTS as readonly string[]).includes(event.type)) {
    return new Response('OK', { status: 200 })
  }

  const subscription = event.data.object as Stripe.Subscription
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  const plan: Plan =
    event.type === 'customer.subscription.deleted' ? 'free' : resolvePlan(subscription)

  const user = await db.query.users.findFirst({ where: eq(users.stripeCustomerId, customerId) })
  if (!user) {
    // User may have deleted their account between subscribing and this event —
    // acknowledge so Stripe stops retrying
    log.error('No user for Stripe customer', { customerId, eventType: event.type })
    return new Response('OK', { status: 200 })
  }

  if (user.plan !== plan) {
    try {
      await db.update(users).set({ plan }).where(eq(users.id, user.id))
    } catch (err) {
      log.error('DB write failed', {
        userId: user.id,
        error: err instanceof Error ? err.message : String(err),
      })
      return new Response('Internal Server Error', { status: 500 })
    }
    log.debug('Updated plan from Stripe event', { userId: user.id, plan, eventType: event.type })
  }

  return new Response('OK', { status: 200 })
}
