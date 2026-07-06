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

const mockMemory = {
  id: '22222222-2222-2222-2222-222222222222',
  tripId: '11111111-1111-1111-1111-111111111111',
  userId: 'user-1',
  note: 'Great day',
  lat: null,
  lng: null,
  city: null,
  country: null,
  capturedAt: new Date('2024-03-02'),
  isPublic: false,
  layoutVariant: 'auto',
  sortOrder: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  media: [],
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/memories', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns all of the user’s memories', async () => {
    mockDb.query.memories.findMany.mockResolvedValue([mockMemory])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
  })

  it('returns 500 when DB output fails schema validation', async () => {
    mockDb.query.memories.findMany.mockResolvedValue([{ id: 'bad' }])
    const res = await GET()
    expect(res.status).toBe(500)
  })
})
