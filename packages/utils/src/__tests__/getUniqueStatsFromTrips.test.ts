import { describe, it, expect } from 'vitest'
import type { Trip } from '@passe/types/trip'
import { getUniqueStatsFromTrips } from '../getUniqueStatsFromTrips'

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    userId: 'user_1',
    title: 'Test trip',
    countries: ['Portugal'],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-10'),
    isPublic: true,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
    ...overrides,
  }
}

describe('getUniqueStatsFromTrips', () => {
  it('collects distinct countries across trips', () => {
    const trips = [
      makeTrip({ countries: ['Portugal', 'Spain'] }),
      makeTrip({ countries: ['Spain', 'France'] }),
    ]
    const { uniqueCountries } = getUniqueStatsFromTrips({ trips })
    expect(uniqueCountries).toEqual(new Set(['Portugal', 'Spain', 'France']))
  })

  it('collects distinct start years across trips', () => {
    const trips = [
      makeTrip({ startDate: new Date('2023-03-01') }),
      makeTrip({ startDate: new Date('2023-09-15') }),
      makeTrip({ startDate: new Date('2024-01-02') }),
    ]
    const { uniqueYears } = getUniqueStatsFromTrips({ trips })
    expect(uniqueYears).toEqual(new Set([2023, 2024]))
  })

  it('returns empty sets for no trips', () => {
    const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips: [] })
    expect(uniqueCountries.size).toBe(0)
    expect(uniqueYears.size).toBe(0)
  })
})
