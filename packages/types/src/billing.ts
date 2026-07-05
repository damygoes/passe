import { z } from 'zod'
import { PlanSchema } from './user'

// Plans that can be purchased — everything except 'free'
export const PaidPlanSchema = PlanSchema.exclude(['free'])
export type PaidPlan = z.infer<typeof PaidPlanSchema>

// Body of POST /api/billing/checkout
export const CheckoutRequestSchema = z.object({
  plan: PaidPlanSchema,
})
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>

// Response of POST /api/billing/checkout and POST /api/billing/portal —
// a Stripe-hosted page the client redirects to
export const BillingRedirectSchema = z.object({
  url: z.string().url(),
})
export type BillingRedirect = z.infer<typeof BillingRedirectSchema>
