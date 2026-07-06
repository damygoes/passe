import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))
vi.mock('@/lib/geocode', () => ({ geocodeCityCountry: vi.fn().mockResolvedValue(null) }))

const mockDb = vi.hoisted(() => ({
  query: { trips: { findFirst: vi.fn() }, memories: { findMany: vi.fn() } },
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

const tripId = '11111111-1111-1111-1111-111111111111'
const memoryId = '22222222-2222-2222-2222-222222222222'
const mockTrip = { id: tripId, userId: 'user-1' }
const mockMemory = {
  id: memoryId,
  tripId,
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

function ctx() {
  return { params: Promise.resolve({ id: tripId }) } as never
}

function req(body: unknown) {
  return new Request(`http://localhost/api/trips/${tripId}/memories`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/trips/[id]/memories', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(401)
  })

  it('returns 404 when the trip does not belong to the user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(404)
  })

  it('returns the trip’s memories', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.memories.findMany.mockResolvedValue([mockMemory])
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
  })
})

describe('POST /api/trips/[id]/memories', () => {
  it('returns 404 when the trip does not belong to the user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ note: 'hi', capturedAt: '2024-03-02' }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 403 when the plan memory limit is reached', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.select.mockReturnValueOnce(dbChain([{ plan: 'free' }])).mockReturnValueOnce(
      dbChain([{ memoryCount: 10 }]),
    )
    const res = await POST(req({ note: 'hi', capturedAt: '2024-03-02' }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 400 on an invalid body (no note and no media)', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.select.mockReturnValueOnce(dbChain([{ plan: 'collector' }])).mockReturnValueOnce(
      dbChain([{ memoryCount: 0 }]),
    )
    const res = await POST(req({ capturedAt: '2024-03-02' }), ctx())
    expect(res.status).toBe(400)
  })

  it('creates a memory on the happy path', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.select.mockReturnValueOnce(dbChain([{ plan: 'collector' }])).mockReturnValueOnce(
      dbChain([{ memoryCount: 0 }]),
    )
    mockDb.insert.mockReturnValue(dbChain([mockMemory]))

    const res = await POST(req({ note: 'Great day', capturedAt: '2024-03-02' }), ctx())
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.id).toBe(memoryId)
  })

  it('returns 500 when the memory insert throws', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.select.mockReturnValueOnce(dbChain([{ plan: 'collector' }])).mockReturnValueOnce(
      dbChain([{ memoryCount: 0 }]),
    )
    mockDb.insert.mockImplementation(() => {
      throw new Error('db down')
    })

    const res = await POST(req({ note: 'Great day', capturedAt: '2024-03-02' }), ctx())
    expect(res.status).toBe(500)
  })
})
