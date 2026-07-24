import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockGeneratePostcard = vi.fn()
vi.mock('@/lib/pdf/postcard/generatePostcard', () => ({
  generatePostcard: (...args: unknown[]) => mockGeneratePostcard(...args),
}))

const mockDb = vi.hoisted(() => ({
  query: {
    trips: { findFirst: vi.fn() },
    users: { findFirst: vi.fn() },
    memories: { findFirst: vi.fn() },
  },
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

const tripId = '11111111-1111-1111-1111-111111111111'
const memoryId = '22222222-2222-2222-2222-222222222222'
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

describe('POST /api/trips/[id]/postcard', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(401)
  })

  it('returns 404 when the trip does not exist or belongs to another user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 404 when the user record is missing', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 403 for a free-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 403 for an explorer-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })
    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 400 for an invalid memoryId', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    const res = await POST(req({ memoryId: 'not-a-uuid' }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 400 for a message over 280 characters', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    const res = await POST(req({ memoryId, message: 'a'.repeat(281) }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 400 when the memory does not belong to this trip', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findFirst.mockResolvedValue(undefined)

    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 400 when the memory has no photo', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findFirst.mockResolvedValue({ id: memoryId, media: [] })

    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns a PDF for a collector-plan user with a valid selection', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findFirst.mockResolvedValue({
      id: memoryId,
      media: [{ url: 'passe/user-1/photo.jpg' }],
    })
    mockGeneratePostcard.mockResolvedValue(Buffer.from('%PDF-1.7'))

    const res = await POST(req({ memoryId, message: 'Wish you were here!' }), ctx())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="japan-postcard.pdf"')
  })

  it('returns 500 when postcard generation throws', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.query.memories.findFirst.mockResolvedValue({
      id: memoryId,
      media: [{ url: 'passe/user-1/photo.jpg' }],
    })
    mockGeneratePostcard.mockRejectedValue(new Error('render failed'))

    const res = await POST(req({ memoryId }), ctx())
    expect(res.status).toBe(500)
  })
})
