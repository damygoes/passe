import { auth } from '@clerk/nextjs/server'
import { dbChain } from '@/test/db-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockDb = vi.hoisted(() => ({
  query: { trips: { findFirst: vi.fn(), findMany: vi.fn() }, users: { findFirst: vi.fn() } },
  select: vi.fn(),
  insert: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

const mockTrip = {
  id: '11111111-1111-1111-1111-111111111111',
  userId: 'user-1',
  title: 'Japan',
  description: null,
  coverImageUrl: null,
  countries: ['JP'],
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function req(body: unknown) {
  return new Request('http://localhost/api/trips', { method: 'POST', body: JSON.stringify(body) })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/trips', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns the current user’s trips', async () => {
    mockDb.query.trips.findMany.mockResolvedValue([mockTrip])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe('11111111-1111-1111-1111-111111111111')
  })

  it('returns 500 when DB output fails schema validation', async () => {
    mockDb.query.trips.findMany.mockResolvedValue([{ id: 'bad' }])
    const res = await GET()
    expect(res.status).toBe(500)
  })
})

describe('POST /api/trips', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req({}))
    expect(res.status).toBe(401)
  })

  it('returns 400 on an invalid body', async () => {
    const res = await POST(req({ title: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 403 when the free plan trip limit is reached', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    mockDb.select.mockReturnValue(dbChain([{ tripCount: 3 }]))

    const res = await POST(
      req({ title: 'New trip', countries: ['FR'], startDate: '2024-01-01', endDate: '2024-01-05' }),
    )
    expect(res.status).toBe(403)
  })

  it('returns 403 when a free-plan user tries to publish', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    mockDb.select.mockReturnValue(dbChain([{ tripCount: 0 }]))

    const res = await POST(
      req({
        title: 'New trip',
        countries: ['FR'],
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        isPublic: true,
      }),
    )
    expect(res.status).toBe(403)
  })

  it('creates a trip on the happy path', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.select.mockReturnValue(dbChain([{ tripCount: 0 }]))
    mockDb.insert.mockReturnValue(dbChain([mockTrip]))

    const res = await POST(
      req({ title: 'Japan', countries: ['JP'], startDate: '2024-03-01', endDate: '2024-03-15' }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.id).toBe('11111111-1111-1111-1111-111111111111')
  })

  it('returns 500 when the DB write throws', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'collector' })
    mockDb.select.mockReturnValue(dbChain([{ tripCount: 0 }]))
    mockDb.insert.mockImplementation(() => {
      throw new Error('db down')
    })

    const res = await POST(
      req({ title: 'Japan', countries: ['JP'], startDate: '2024-03-01', endDate: '2024-03-15' }),
    )
    expect(res.status).toBe(500)
  })
})
