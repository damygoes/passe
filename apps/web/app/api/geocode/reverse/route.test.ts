import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))
vi.mock('@/lib/geocode/geocode', () => ({
  reverseGeocode: vi
    .fn()
    .mockResolvedValue({ city: 'Kyoto', country: 'Japan', placeName: 'Kyoto, Japan' }),
}))

function req(query: string) {
  return new Request(`http://localhost/api/geocode/reverse${query}`)
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/geocode/reverse', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET(req('?lat=1&lng=2'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when lat/lng are not finite numbers', async () => {
    const res = await GET(req('?lat=abc&lng=2'))
    expect(res.status).toBe(400)
  })

  it('returns the reverse-geocoded city/country', async () => {
    const res = await GET(req('?lat=35&lng=135'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual({ city: 'Kyoto', country: 'Japan', placeName: 'Kyoto, Japan' })
  })
})
