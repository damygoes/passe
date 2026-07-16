import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DELETE, GET, PATCH } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockDb = vi.hoisted(() => ({
  query: { trips: { findFirst: vi.fn() } },
  update: vi.fn(),
  delete: vi.fn(),
  select: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

const tripId = '11111111-1111-1111-1111-111111111111'
const mockTrip = {
  id: tripId,
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

function ctx() {
  return { params: Promise.resolve({ id: tripId }) } as never
}

function req(body: unknown) {
  return new Request(`http://localhost/api/trips/${tripId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
  mockDb.select.mockReturnValue(dbChain([]))
})

describe('GET /api/trips/[id]', () => {
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

  it('returns the trip on success', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(mockTrip)
    const res = await GET(new Request('http://localhost'), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe(tripId)
  })
})

describe('PATCH /api/trips/[id]', () => {
  it('returns 400 on an invalid body', async () => {
    const res = await PATCH(req({ startDate: 'not-a-date' }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 404 when no row was updated', async () => {
    mockDb.update.mockReturnValue(dbChain([]))
    const res = await PATCH(req({ title: 'Updated' }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 500 when the DB write throws', async () => {
    mockDb.update.mockImplementation(() => {
      throw new Error('db down')
    })
    const res = await PATCH(req({ title: 'Updated' }), ctx())
    expect(res.status).toBe(500)
  })

  it('returns the updated trip on success', async () => {
    mockDb.update.mockReturnValue(dbChain([{ ...mockTrip, title: 'Updated' }]))
    const res = await PATCH(req({ title: 'Updated' }), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.title).toBe('Updated')
  })
})

describe('DELETE /api/trips/[id]', () => {
  it('returns 404 when no row was deleted', async () => {
    mockDb.delete.mockReturnValue(dbChain([]))
    const res = await DELETE(new Request('http://localhost'), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 500 when the DB write throws', async () => {
    mockDb.delete.mockImplementation(() => {
      throw new Error('db down')
    })
    const res = await DELETE(new Request('http://localhost'), ctx())
    expect(res.status).toBe(500)
  })

  it('deletes the trip on success', async () => {
    mockDb.delete.mockReturnValue(dbChain([{ id: tripId }]))
    const res = await DELETE(new Request('http://localhost'), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe(tripId)
  })
})
