import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockDb = vi.hoisted(() => ({
  query: { memories: { findMany: vi.fn() } },
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/memories/map', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('flattens media to a single thumbnailUrl per point', async () => {
    mockDb.query.memories.findMany.mockResolvedValue([
      {
        id: '22222222-2222-2222-2222-222222222222',
        tripId: '11111111-1111-1111-1111-111111111111',
        lat: 48.8,
        lng: 2.3,
        city: 'Paris',
        country: 'France',
        note: null,
        media: [{ url: 'https://example.com/a.jpg' }],
      },
    ])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data[0].thumbnailUrl).toBe('https://example.com/a.jpg')
    expect(body.data[0]).not.toHaveProperty('media')
  })

  it('sets thumbnailUrl to null when there is no media', async () => {
    mockDb.query.memories.findMany.mockResolvedValue([
      {
        id: '22222222-2222-2222-2222-222222222222',
        tripId: '11111111-1111-1111-1111-111111111111',
        lat: 48.8,
        lng: 2.3,
        city: null,
        country: null,
        note: null,
        media: [],
      },
    ])
    const res = await GET()
    const body = await res.json()
    expect(body.data[0].thumbnailUrl).toBeNull()
  })
})
