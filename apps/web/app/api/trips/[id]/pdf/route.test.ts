import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockGenerateTripPdf = vi.fn()
vi.mock('@/lib/pdf/generateTripPdf', () => ({
  generateTripPdf: (...args: unknown[]) => mockGenerateTripPdf(...args),
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
const mockTrip = {
  id: tripId,
  userId: 'user-1',
  title: 'Japan',
  countries: ['JP'],
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
}

function ctx() {
  return { params: Promise.resolve({ id: tripId }) } as never
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
  mockDb.query.memories.findMany.mockResolvedValue([])
})

describe('GET /api/trips/[id]/pdf', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(401)
  })

  it('returns 404 when the trip does not exist or belongs to another user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 404 when the user record is missing', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 403 for a free-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 403 for an explorer-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(403)
  })

  it('returns a PDF for a collector-plan user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockGenerateTripPdf.mockResolvedValue(Buffer.from('%PDF-1.7'))

    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="japan.pdf"')
  })

  it('returns 500 when PDF generation throws', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockGenerateTripPdf.mockRejectedValue(new Error('render failed'))

    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(500)
  })
})
