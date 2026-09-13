import { describe, it, expect } from 'vitest'
import type { Trip } from '@passe/types/trip'
import type { Memory } from '@passe/types/memory'
import { getPersonalStatsFacts } from '../getPersonalStatsFacts'

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

function makeMemory(overrides: Partial<Memory> = {}): Memory {
  return {
    id: '22222222-2222-4222-8222-222222222222',
    tripId: '11111111-1111-4111-8111-111111111111',
    userId: 'user_1',
    note: null,
    media: [],
    location: null,
    city: null,
    country: null,
    placeName: null,
    tags: [],
    capturedAt: new Date('2024-06-02'),
    isPublic: false,
    layoutVariant: 'auto',
    sortOrder: null,
    createdAt: new Date('2024-06-02'),
    updatedAt: new Date('2024-06-02'),
    ...overrides,
  }
}

describe('getPersonalStatsFacts', () => {
  it('picks the most recently first-visited country', () => {
    const trips = [
      makeTrip({ countries: ['Portugal'], startDate: new Date('2020-01-01') }),
      makeTrip({ countries: ['Japan'], startDate: new Date('2024-01-01') }),
    ]
    const { mostRecentCountry } = getPersonalStatsFacts({ trips, memories: [] })
    expect(mostRecentCountry).toBe('Japan')
  })

  it('counts cities visited more than once', () => {
    const memories = [
      makeMemory({ city: 'Lisbon' }),
      makeMemory({ city: 'Lisbon' }),
      makeMemory({ city: 'Porto' }),
    ]
    const { repeatCitiesCount } = getPersonalStatsFacts({ trips: [], memories })
    expect(repeatCitiesCount).toBe(1)
  })

  it('sums days away across trips', () => {
    const trips = [
      makeTrip({ startDate: new Date('2024-01-01'), endDate: new Date('2024-01-05') }),
      makeTrip({ startDate: new Date('2024-02-01'), endDate: new Date('2024-02-03') }),
    ]
    const { daysAwayCount } = getPersonalStatsFacts({ trips, memories: [] })
    expect(daysAwayCount).toBe(6)
  })

  it('counts private memories', () => {
    const memories = [
      makeMemory({ isPublic: true }),
      makeMemory({ isPublic: false }),
      makeMemory({ isPublic: false }),
    ]
    const { privateMemoriesCount, memoriesCount } = getPersonalStatsFacts({
      trips: [],
      memories,
    })
    expect(privateMemoriesCount).toBe(2)
    expect(memoriesCount).toBe(3)
  })

  it('finds the memory furthest from the first geotagged memory', () => {
    const memories = [
      makeMemory({
        capturedAt: new Date('2024-01-01'),
        location: { lat: 51.5074, lng: -0.1278 }, // London — "home"
        city: 'London',
      }),
      makeMemory({
        capturedAt: new Date('2024-02-01'),
        location: { lat: 48.8566, lng: 2.3522 }, // Paris — close
        city: 'Paris',
      }),
      makeMemory({
        capturedAt: new Date('2024-03-01'),
        location: { lat: -13.1631, lng: -72.545 }, // Cusco — far
        city: 'Cusco',
        country: 'Peru',
      }),
    ]
    const { furthestMemory } = getPersonalStatsFacts({ trips: [], memories })
    expect(furthestMemory?.city).toBe('Cusco')
    expect(furthestMemory?.distanceKm).toBeGreaterThan(9000)
  })

  it('returns null furthestMemory with fewer than two geotagged memories', () => {
    const memories = [makeMemory({ location: { lat: 51.5, lng: -0.1 } })]
    const { furthestMemory } = getPersonalStatsFacts({ trips: [], memories })
    expect(furthestMemory).toBeNull()
  })

  it('finds the quietest month across all years', () => {
    const memories = [
      makeMemory({ capturedAt: new Date('2023-03-05') }),
      makeMemory({ capturedAt: new Date('2024-03-15') }),
      makeMemory({ capturedAt: new Date('2024-07-10') }),
    ]
    const { quietestMonth } = getPersonalStatsFacts({ trips: [], memories })
    // January (0) never appears, tied with several others at 0 — indexOf
    // picks the first zero-count month, which is January.
    expect(quietestMonth?.monthIndex).toBe(0)
    expect(quietestMonth?.count).toBe(0)
  })

  it('returns null quietestMonth with no memories', () => {
    const { quietestMonth } = getPersonalStatsFacts({ trips: [], memories: [] })
    expect(quietestMonth).toBeNull()
  })
})
