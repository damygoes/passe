import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fromDbMemory, toDbMemoryValues } from './memory'

beforeEach(() => {
  vi.stubEnv('MEDIA_URL_SIGNING_SECRET', 'test-secret')
  vi.stubEnv('APP_URL', 'http://localhost:3000')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('fromDbMemory', () => {
  it('resolves media urls into signed delivery URLs', () => {
    const result = fromDbMemory({
      id: '1',
      lat: null,
      lng: null,
      isPublic: false,
      media: [{ url: 'passe/user-1/a.jpg' }],
    } as never)
    expect(result.media[0]?.url).toMatch(/^http:\/\/localhost:3000\/api\/media\//)
  })

  it('builds a location object when lat/lng are present', () => {
    const result = fromDbMemory({
      id: '1',
      lat: 1.5,
      lng: 2.5,
      media: [],
    } as never)
    expect(result.location).toEqual({ lat: 1.5, lng: 2.5 })
  })

  it('returns a null location when lat or lng is missing', () => {
    const result = fromDbMemory({ id: '1', lat: null, lng: null, media: [] } as never)
    expect(result.location).toBeNull()
  })

  it('defaults media to an empty array when absent', () => {
    const result = fromDbMemory({ id: '1', lat: null, lng: null } as never)
    expect(result.media).toEqual([])
  })

  it('strips lat/lng from the top-level result', () => {
    const result = fromDbMemory({ id: '1', lat: 1, lng: 2, media: [] } as never)
    expect(result).not.toHaveProperty('lat')
    expect(result).not.toHaveProperty('lng')
  })
})

describe('toDbMemoryValues', () => {
  it('leaves location untouched when the key is absent (partial update)', () => {
    const update: { note: string; location?: { lat: number; lng: number } | null } = {
      note: 'hello',
    }
    const result = toDbMemoryValues(update)
    expect(result).toEqual({ note: 'hello' })
    expect(result).not.toHaveProperty('lat')
  })

  it('writes lat/lng from a provided location', () => {
    const result = toDbMemoryValues({ note: 'hello', location: { lat: 1, lng: 2 } })
    expect(result).toEqual({ note: 'hello', lat: 1, lng: 2 })
  })

  it('clears lat/lng to null when location is explicitly null', () => {
    const result = toDbMemoryValues({ note: 'hello', location: null })
    expect(result).toEqual({ note: 'hello', lat: null, lng: null })
  })

  it('strips media from the result', () => {
    const result = toDbMemoryValues({ note: 'hello', media: [{ url: 'x' }] })
    expect(result).not.toHaveProperty('media')
  })
})
