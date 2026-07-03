import { describe, it, expect } from 'vitest'
import type { Memory } from '@passe/types/memory'
import { getUniqueCities } from '../getUniqueCities'

function makeMemory(overrides: Partial<Memory> = {}): Memory {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    tripId: '22222222-2222-4222-8222-222222222222',
    userId: 'user_1',
    capturedAt: new Date('2024-06-01'),
    isPublic: false,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
    ...overrides,
  }
}

describe('getUniqueCities', () => {
  it('collects distinct cities across memories', () => {
    const allMemories = [
      makeMemory({ city: 'Lisbon' }),
      makeMemory({ city: 'Porto' }),
      makeMemory({ city: 'Lisbon' }),
    ]
    const { uniqueCities } = getUniqueCities({ allMemories })
    expect(uniqueCities).toEqual(new Set(['Lisbon', 'Porto']))
  })

  it('skips memories without a city', () => {
    const allMemories = [makeMemory(), makeMemory({ city: 'Kyoto' })]
    const { uniqueCities } = getUniqueCities({ allMemories })
    expect(uniqueCities).toEqual(new Set(['Kyoto']))
  })

  it('returns an empty set for no memories', () => {
    const { uniqueCities } = getUniqueCities({ allMemories: [] })
    expect(uniqueCities.size).toBe(0)
  })
})
