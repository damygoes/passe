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
