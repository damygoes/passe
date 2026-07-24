import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockGenerateTripZine = vi.fn()
vi.mock('@/lib/pdf/zine/generateTripZine', () => ({
  generateTripZine: (...args: unknown[]) => mockGenerateTripZine(...args),
}))

const mockDb = vi.hoisted(() => ({
  query: {
    trips: { findFirst: vi.fn() },
    users: { findFirst: vi.fn() },
    memories: { findMany: vi.fn() },
  },
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

const tripId = '11111111-1111-1111-1111-111111111111'
const memoryId1 = '22222222-2222-2222-2222-222222222222'
const memoryId2 = '33333333-3333-3333-3333-333333333333'
const memoryId3 = '44444444-4444-4444-4444-444444444444'
const memoryId4 = '55555555-5555-5555-5555-555555555555'
const memoryId5 = '66666666-6666-6666-6666-666666666666'
const memoryId6 = '77777777-7777-7777-7777-777777777777'
const sixMemoryIds = [memoryId1, memoryId2, memoryId3, memoryId4, memoryId5, memoryId6]
const mockTrip = {
  id: tripId,
  userId: 'user-1',
  title: 'Japan',
  countries: ['JP'],
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
}

function req(body: unknown) {
  return new Request('http://localhost', { method: 'POST', body: JSON.stringify(body) })
}

function ctx() {
  return { params: Promise.resolve({ id: tripId }) } as never
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('POST /api/trips/[id]/zine', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req({ memoryIds: [memoryId1] }), ctx())
    expect(res.status).toBe(401)
  })

  it('returns 404 when the trip does not exist or belongs to another user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ memoryIds: [memoryId1] }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 404 when the user record is missing', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ memoryIds: [memoryId1] }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 403 for a free-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    const res = await POST(req({ memoryIds: [memoryId1] }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 403 for an explorer-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })
    const res = await POST(req({ memoryIds: [memoryId1] }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 400 for an undersized memoryIds selection', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    const res = await POST(req({ memoryIds: [memoryId1, memoryId2] }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 400 for an oversized memoryIds selection', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    const res = await POST(
      req({ memoryIds: [...sixMemoryIds, '88888888-8888-8888-8888-888888888888'] }),
      ctx(),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when a memoryId does not belong to this trip', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findMany.mockResolvedValue([{ id: memoryId1, media: [] }])

    const res = await POST(req({ memoryIds: sixMemoryIds }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns a PDF for a collector-plan user with a valid selection', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findMany.mockResolvedValue(sixMemoryIds.map((id) => ({ id, media: [] })))
    mockGenerateTripZine.mockResolvedValue(Buffer.from('%PDF-1.7'))

    const res = await POST(req({ memoryIds: sixMemoryIds }), ctx())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="japan-zine.pdf"')
  })

  it('returns 500 when zine generation throws', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findMany.mockResolvedValue(sixMemoryIds.map((id) => ({ id, media: [] })))
    mockGenerateTripZine.mockRejectedValue(new Error('render failed'))

    const res = await POST(req({ memoryIds: sixMemoryIds }), ctx())
    expect(res.status).toBe(500)
  })
})
