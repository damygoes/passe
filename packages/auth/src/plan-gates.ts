import type { PlanType } from './types'

export const PLAN_LIMITS = {
  free: {
    maxTrips: 3,
    maxMemoriesPerTrip: 10,
    publicPortfolio: false,
    maxPublicMemoriesPerTrip: 3,
    pdfExport: false,
  },
  explorer: {
    maxTrips: 20,
    maxMemoriesPerTrip: 50,
    publicPortfolio: true,
    maxPublicMemoriesPerTrip: Infinity,
    pdfExport: false,
  },
  collector: {
    maxTrips: Infinity,
    maxMemoriesPerTrip: Infinity,
    publicPortfolio: true,
    maxPublicMemoriesPerTrip: Infinity,
    pdfExport: true,
  },
} as const satisfies Record<
  PlanType,
  {
    maxTrips: number
    maxMemoriesPerTrip: number
    publicPortfolio: boolean
    maxPublicMemoriesPerTrip: number
    pdfExport: boolean
  }
>

export function canCreateTrip(plan: PlanType, currentTripCount: number): boolean {
  return currentTripCount < PLAN_LIMITS[plan].maxTrips
}

export function canAddMemory(plan: PlanType, currentMemoryCount: number): boolean {
  return currentMemoryCount < PLAN_LIMITS[plan].maxMemoriesPerTrip
}

export function canMakePortfolioPublic(plan: PlanType): boolean {
  return PLAN_LIMITS[plan].publicPortfolio
}

export function canMakeMemoryPublic(plan: PlanType, currentPublicMemoryCount: number): boolean {
  return currentPublicMemoryCount < PLAN_LIMITS[plan].maxPublicMemoriesPerTrip
}

export interface PlanSlots {
  used: number
  limit: number | null
  remaining: number | null
  isUnlimited: boolean
}

function computeSlots(used: number, limit: number): PlanSlots {
  const isUnlimited = limit === Infinity
  return {
    used,
    limit: isUnlimited ? null : limit,
    remaining: isUnlimited ? null : Math.max(0, limit - used),
    isUnlimited,
  }
}

// Single source of truth for the "2 of 3 public memories left on Free" /
// "Unlimited public memories" captions on both platforms — derive this
// instead of reimplementing the used/remaining math per screen.
export function getPublicMemorySlots(plan: PlanType, currentPublicCount: number): PlanSlots {
  return computeSlots(currentPublicCount, PLAN_LIMITS[plan].maxPublicMemoriesPerTrip)
}

// Same idea for the Trips screen's "3 of 3 trips kept" / "Unlimited trips"
// quota meter.
export function getTripSlots(plan: PlanType, currentTripCount: number): PlanSlots {
  return computeSlots(currentTripCount, PLAN_LIMITS[plan].maxTrips)
}

export function canExportPdf(plan: PlanType): boolean {
  return PLAN_LIMITS[plan].pdfExport
}

// Cheapest tier first — `upgradePlanFor` walks this to find the next plan up.
const PLAN_ORDER = ['free', 'explorer', 'collector'] as const satisfies readonly PlanType[]

type LimitKey = keyof (typeof PLAN_LIMITS)['free']

/** A feature a user can be blocked on, and therefore a reason for landing on the paywall. */
export type GatedFeature =
  'trips' | 'memories' | 'portfolio' | 'public_memories' | 'pdf' | 'zine' | 'postcard'

// Each feature points at the PLAN_LIMITS key that gates it, so the plan a paywall
// should recommend is derived from the limits rather than restated beside them —
// change a limit and the paywall follows. All three keepsake exports share the
// single `pdfExport` flag.
const FEATURE_LIMIT_KEYS = {
  trips: 'maxTrips',
  memories: 'maxMemoriesPerTrip',
  portfolio: 'publicPortfolio',
  public_memories: 'maxPublicMemoriesPerTrip',
  pdf: 'pdfExport',
  zine: 'pdfExport',
  postcard: 'pdfExport',
} as const satisfies Record<GatedFeature, LimitKey>

// Booleans become 0/1 so one `>` comparison covers both the flags and the
// numeric limits (including Infinity).
function limitScore(plan: PlanType, key: LimitKey): number {
  const value: number | boolean = PLAN_LIMITS[plan][key]
  return typeof value === 'boolean' ? Number(value) : value
}

/**
 * The cheapest plan above `currentPlan` that actually improves `feature`, or null
 * when `currentPlan` is already the best for it. Callers treat null as "no
 * contextual highlight" — e.g. a Collector who deep-links the paywall.
 */
export function upgradePlanFor(feature: GatedFeature, currentPlan: PlanType): PlanType | null {
  const key = FEATURE_LIMIT_KEYS[feature]
  const current = limitScore(currentPlan, key)
  return (
    PLAN_ORDER.slice(PLAN_ORDER.indexOf(currentPlan) + 1).find(
      (plan) => limitScore(plan, key) > current,
    ) ?? null
  )
}

// The reason reaches the paywall as a query param, so it is untrusted input and
// has to be validated before it indexes FEATURE_LIMIT_KEYS. Object.hasOwn rather
// than `in`, which would also accept inherited keys like 'toString'.
export function isGatedFeature(value: string | undefined): value is GatedFeature {
  return value !== undefined && Object.hasOwn(FEATURE_LIMIT_KEYS, value)
}
