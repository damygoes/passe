import type { MapPoint } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'
import { getRecentPins } from './getRecentPins'

function makePoint(overrides: Partial<MapPoint> = {}): MapPoint {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    tripId: 'trip-1',
    lat: 31.63,
    lng: -7.99,
    city: 'Marrakesh',
    country: 'Morocco',
    note: null,
    thumbnailUrl: null,
    thumbnailPlaceholder: null,
    ...overrides,
  }
}

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 'trip-1',
    userId: 'user_1',
    title: 'Morocco',
    countries: ['Morocco'],
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-10'),
    isPublic: false,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
    ...overrides,
  }
}

describe('getRecentPins', () => {
  it('formats a pin with its trip date and uppercased country', () => {
    const points = [makePoint()]
    const trips = [makeTrip()]

    expect(getRecentPins(points, trips)).toEqual([
      { id: 'Marrakesh|Morocco', name: 'Marrakesh', meta: 'MOROCCO · MAR 2026' },
    ])
  })

  it('collapses multiple memories in the same city into one row', () => {
    const points = [
      makePoint({ id: 'a' }),
      makePoint({ id: 'b' }),
      makePoint({ id: 'c', city: 'Fès' }),
    ]
    const trips = [makeTrip()]

    expect(getRecentPins(points, trips)).toHaveLength(2)
  })

  it('sorts by the most recent trip first', () => {
    const points = [
      makePoint({ tripId: 'trip-old', city: 'Évora', country: 'Portugal' }),
      makePoint({ tripId: 'trip-new', city: 'Aomori', country: 'Japan' }),
    ]
    const trips = [
      makeTrip({ id: 'trip-old', startDate: new Date('2025-06-01') }),
      makeTrip({ id: 'trip-new', startDate: new Date('2025-10-01') }),
    ]

    expect(getRecentPins(points, trips).map((pin) => pin.name)).toEqual(['Aomori', 'Évora'])
  })

  it('limits to the given number of pins', () => {
    const points = ['A', 'B', 'C', 'D', 'E'].map((city, index) =>
      makePoint({ id: city, city, tripId: `trip-${index}` }),
    )
    const trips = ['A', 'B', 'C', 'D', 'E'].map((_, index) =>
      makeTrip({ id: `trip-${index}`, startDate: new Date(2020 + index, 0, 1) }),
    )

    expect(getRecentPins(points, trips, 3)).toHaveLength(3)
  })

  it('skips points without a city or a matching trip', () => {
    const points = [
      makePoint({ city: null }),
      makePoint({ tripId: 'missing-trip' }),
      makePoint({ id: 'kept' }),
    ]
    const trips = [makeTrip()]

    expect(getRecentPins(points, trips)).toEqual([
      { id: 'Marrakesh|Morocco', name: 'Marrakesh', meta: 'MOROCCO · MAR 2026' },
    ])
  })

  it('omits the country from meta when a point has none', () => {
    const points = [makePoint({ country: null })]
    const trips = [makeTrip()]

    expect(getRecentPins(points, trips)).toEqual([
      { id: 'Marrakesh|', name: 'Marrakesh', meta: 'MAR 2026' },
    ])
  })
})
