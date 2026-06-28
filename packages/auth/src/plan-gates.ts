import type { PlanType } from './types'

export const PLAN_LIMITS = {
  free: { maxTrips: 3, maxMemoriesPerTrip: 10, publicPortfolio: false },
  explorer: { maxTrips: 20, maxMemoriesPerTrip: 50, publicPortfolio: true },
  collector: { maxTrips: Infinity, maxMemoriesPerTrip: Infinity, publicPortfolio: true },
} as const satisfies Record<
  PlanType,
  { maxTrips: number; maxMemoriesPerTrip: number; publicPortfolio: boolean }
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
