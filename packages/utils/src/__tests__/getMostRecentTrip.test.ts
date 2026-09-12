import { describe, it, expect } from 'vitest'
import { getMostRecentTrip } from '../getMostRecentTrip'

describe('getMostRecentTrip', () => {
  it('returns null for an empty list', () => {
    expect(getMostRecentTrip([])).toBeNull()
  })

  it('returns the only trip when there is one', () => {
    const trip = { id: '1', createdAt: new Date('2026-01-01') }
    expect(getMostRecentTrip([trip])).toBe(trip)
  })

  it('returns the trip with the latest createdAt', () => {
    const older = { id: '1', createdAt: new Date('2026-01-01') }
    const newer = { id: '2', createdAt: new Date('2026-06-01') }
    const middle = { id: '3', createdAt: new Date('2026-03-01') }
    expect(getMostRecentTrip([older, newer, middle])).toBe(newer)
  })
})
