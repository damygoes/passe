import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { getStripe } from '@/lib/stripe'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/billing/portal' } })

// POST /api/billing/portal — create a Stripe Customer Portal session where
// subscribers switch plans, update payment methods, or cancel.
export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return apiError('User not found', 404)
  if (!user.stripeCustomerId) return apiError('No billing account for this user', 400)

  const origin = new URL(req.url).origin

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/billing`,
    })

    log.debug('Created portal session', { userId })
    return apiSuccess({ url: session.url })
  } catch (err) {
    log.error('Portal session creation failed', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }
}
