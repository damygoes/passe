import { describe, it, expect } from 'vitest'
import type { Trip } from '@passe/types/trip'
import { getVisitedCountries } from '../getVisitedCountries'

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    userId: 'user_1',
    title: 'Trip',
    description: null,
    coverImageUrl: null,
    coverImagePlaceholder: null,
    coverImageSrcset: null,
    countries: ['Portugal'],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-05'),
    isPublic: false,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
    ...overrides,
  }
}

describe('getVisitedCountries', () => {
  it('collects distinct countries across trips', () => {
    const allTrips = [
      makeTrip({ countries: ['Portugal'] }),
      makeTrip({ countries: ['Japan', 'Vietnam'] }),
      makeTrip({ countries: ['Portugal'] }),
    ]
    const { visitedCountries } = getVisitedCountries({ allTrips })
    expect(visitedCountries).toEqual(new Set(['Portugal', 'Japan', 'Vietnam']))
  })

  it('returns an empty set for no trips', () => {
    const { visitedCountries } = getVisitedCountries({ allTrips: [] })
    expect(visitedCountries.size).toBe(0)
  })
})
