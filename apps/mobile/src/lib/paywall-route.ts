import type { GatedFeature } from '@passe/auth/plan-gates'

// Upgrade CTAs tag themselves with the feature the user was blocked on, so the
// paywall can feature and pre-select the plan that actually unlocks it. Built
// here rather than hand-written at each of the ten call sites: an untyped param
// typo is silent, and getting it wrong matters — Explorer does not include the
// keepsake exports, so recommending it to someone blocked on one sells the
// wrong tier.
export const paywallRoute = (reason?: GatedFeature) =>
  reason ? (`/(app)/account/paywall?reason=${reason}` as const) : '/(app)/account/paywall'
