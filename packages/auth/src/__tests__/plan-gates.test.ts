import { describe, it, expect } from 'vitest'
import {
  canCreateTrip,
  canAddMemory,
  canMakePortfolioPublic,
  canExportPdf,
  getPublicMemorySlots,
  PLAN_LIMITS,
} from '../plan-gates'

describe('canCreateTrip', () => {
  it('allows free plan under the limit', () => {
    expect(canCreateTrip('free', 0)).toBe(true)
    expect(canCreateTrip('free', 2)).toBe(true)
  })

  it('blocks free plan at the limit', () => {
    expect(canCreateTrip('free', 3)).toBe(false)
    expect(canCreateTrip('free', 10)).toBe(false)
  })

  it('allows explorer plan under the limit', () => {
    expect(canCreateTrip('explorer', 0)).toBe(true)
    expect(canCreateTrip('explorer', 19)).toBe(true)
  })

  it('blocks explorer plan at the limit', () => {
    expect(canCreateTrip('explorer', 20)).toBe(false)
  })

  it('always allows collector plan', () => {
    expect(canCreateTrip('collector', 0)).toBe(true)
    expect(canCreateTrip('collector', 1000)).toBe(true)
  })
})

describe('canAddMemory', () => {
  it('allows free plan under the limit', () => {
    expect(canAddMemory('free', 0)).toBe(true)
    expect(canAddMemory('free', 9)).toBe(true)
  })

  it('blocks free plan at the limit', () => {
    expect(canAddMemory('free', 10)).toBe(false)
  })

  it('allows explorer plan under the limit', () => {
    expect(canAddMemory('explorer', 49)).toBe(true)
  })

  it('blocks explorer plan at the limit', () => {
    expect(canAddMemory('explorer', 50)).toBe(false)
  })

  it('always allows collector plan', () => {
    expect(canAddMemory('collector', 0)).toBe(true)
    expect(canAddMemory('collector', 9999)).toBe(true)
  })
})

describe('canMakePortfolioPublic', () => {
  it('blocks free plan', () => {
    expect(canMakePortfolioPublic('free')).toBe(false)
  })

  it('allows explorer plan', () => {
    expect(canMakePortfolioPublic('explorer')).toBe(true)
  })

  it('allows collector plan', () => {
    expect(canMakePortfolioPublic('collector')).toBe(true)
  })
})

describe('canExportPdf', () => {
  it('blocks free plan', () => {
    expect(canExportPdf('free')).toBe(false)
  })

  it('blocks explorer plan', () => {
    expect(canExportPdf('explorer')).toBe(false)
  })

  it('allows collector plan', () => {
    expect(canExportPdf('collector')).toBe(true)
  })
})

describe('getPublicMemorySlots', () => {
  it('reports used/remaining for free plan under the limit', () => {
    expect(getPublicMemorySlots('free', 1)).toEqual({
      used: 1,
      limit: 3,
      remaining: 2,
      isUnlimited: false,
    })
  })

  it('clamps remaining at zero once free plan is at or over the limit', () => {
    expect(getPublicMemorySlots('free', 3)).toEqual({
      used: 3,
      limit: 3,
      remaining: 0,
      isUnlimited: false,
    })
    expect(getPublicMemorySlots('free', 5)).toEqual({
      used: 5,
      limit: 3,
      remaining: 0,
      isUnlimited: false,
    })
  })

  it('reports unlimited for explorer and collector plans', () => {
    expect(getPublicMemorySlots('explorer', 40)).toEqual({
      used: 40,
      limit: null,
      remaining: null,
      isUnlimited: true,
    })
    expect(getPublicMemorySlots('collector', 999)).toEqual({
      used: 999,
      limit: null,
      remaining: null,
      isUnlimited: true,
    })
  })
})

describe('PLAN_LIMITS', () => {
  it('exposes the documented limits', () => {
    expect(PLAN_LIMITS.free.maxTrips).toBe(3)
    expect(PLAN_LIMITS.free.maxMemoriesPerTrip).toBe(10)
    expect(PLAN_LIMITS.free.publicPortfolio).toBe(false)
    expect(PLAN_LIMITS.free.pdfExport).toBe(false)
    expect(PLAN_LIMITS.explorer.maxTrips).toBe(20)
    expect(PLAN_LIMITS.explorer.maxMemoriesPerTrip).toBe(50)
    expect(PLAN_LIMITS.explorer.publicPortfolio).toBe(true)
    expect(PLAN_LIMITS.explorer.pdfExport).toBe(false)
    expect(PLAN_LIMITS.collector.maxTrips).toBe(Infinity)
    expect(PLAN_LIMITS.collector.maxMemoriesPerTrip).toBe(Infinity)
    expect(PLAN_LIMITS.collector.publicPortfolio).toBe(true)
    expect(PLAN_LIMITS.collector.pdfExport).toBe(true)
  })
})
