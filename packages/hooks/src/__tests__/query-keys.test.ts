import { describe, it, expect } from 'vitest'
import { queryKeys } from '../query-keys'

describe('queryKeys', () => {
  it('user() returns ["user"]', () => {
    expect(queryKeys.user()).toEqual(['user'])
  })

  it('trips() returns ["trips"]', () => {
    expect(queryKeys.trips()).toEqual(['trips'])
  })

  it('trip(id) returns ["trips", id]', () => {
    expect(queryKeys.trip('abc-123')).toEqual(['trips', 'abc-123'])
  })

  it('memories(tripId) returns ["trips", tripId, "memories"]', () => {
    expect(queryKeys.memories('trip-42')).toEqual(['trips', 'trip-42', 'memories'])
  })

  it('trip keys for different ids are distinct', () => {
    expect(queryKeys.trip('a')).not.toEqual(queryKeys.trip('b'))
  })

  it('memories keys for different tripIds are distinct', () => {
    expect(queryKeys.memories('trip-1')).not.toEqual(queryKeys.memories('trip-2'))
  })
})
