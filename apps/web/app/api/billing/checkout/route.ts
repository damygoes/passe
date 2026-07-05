import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { getOrCreateStripeCustomer, getStripe, planToPriceId } from '@/lib/stripe'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { CheckoutRequestSchema } from '@passe/types/billing'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/billing/checkout' } })

// POST /api/billing/checkout — create a Stripe Checkout session for a paid plan.
// Returns the hosted Checkout URL; the client redirects there. Plan activation
// happens via the Stripe webhook, never in this route.
export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const parsed = CheckoutRequestSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return apiError('User not found', 404)

  // Plan changes for already-subscribed users go through the Customer Portal —
  // a second Checkout would create a second subscription.
  if (user.plan !== 'free') {
    return apiError('Already subscribed — manage your plan via the billing portal', 409)
  }

  const origin = new URL(req.url).origin

  try {
    const customerId = await getOrCreateStripeCustomer(userId)
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: planToPriceId(parsed.data.plan), quantity: 1 }],
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: { userId },
    })

    if (!session.url) {
      log.error('Checkout session created without URL', { userId })
      return apiError('Internal server error', 500)
    }

    log.debug('Created checkout session', { userId, plan: parsed.data.plan })
    return apiSuccess({ url: session.url })
  } catch (err) {
    log.error('Checkout session creation failed', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }
}
