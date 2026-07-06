import { db } from '@passe/db/client'
import { users } from '@passe/db/schema'
import type { PaidPlan } from '@passe/types'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

// Lazy singleton — module can be imported in files that never touch Stripe
// (e.g. during build) without requiring STRIPE_SECRET_KEY to be set.
let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    stripeClient = new Stripe(key)
  }
  return stripeClient
}

function priceIds(): Record<PaidPlan, string | undefined> {
  return {
    explorer: process.env.STRIPE_PRICE_EXPLORER,
    collector: process.env.STRIPE_PRICE_COLLECTOR,
  }
}

export function planToPriceId(plan: PaidPlan): string {
  const priceId = priceIds()[plan]
  if (!priceId) throw new Error(`Stripe price ID for plan "${plan}" is not set`)
  return priceId
}

export function priceIdToPlan(priceId: string): PaidPlan | null {
  const ids = priceIds()
  if (priceId === ids.explorer) return 'explorer'
  if (priceId === ids.collector) return 'collector'
  return null
}

// Returns the user's Stripe customer ID, creating the customer on first use.
// The customer carries metadata.userId so webhook events can always be traced
// back to a Passé user even if the DB row is looked up by customer ID.
export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) throw new Error(`User ${userId} not found`)
  if (user.stripeCustomerId) return user.stripeCustomerId

  const customer = await getStripe().customers.create({
    email: user.email,
    metadata: { userId },
  })

  await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, userId))

  return customer.id
}
