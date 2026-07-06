import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DELETE, PATCH } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))
vi.mock('@/lib/geocode', () => ({ geocodeCityCountry: vi.fn().mockResolvedValue(null) }))

const mockDb = vi.hoisted(() => ({
  query: { memoryMedia: { findMany: vi.fn().mockResolvedValue([]) } },
  select: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  insert: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

const tripId = '11111111-1111-1111-1111-111111111111'
const memoryId = '22222222-2222-2222-2222-222222222222'
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
}

function ctx() {
  return { params: Promise.resolve({ id: tripId, memoryId }) } as never
}

function req(body: unknown) {
  return new Request(`http://localhost/api/trips/${tripId}/memories/${memoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('PATCH /api/trips/[id]/memories/[memoryId]', () => {
  it('returns 400 on an invalid body', async () => {
    const res = await PATCH(req({ note: 123 }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 403 when the free-plan public-memory limit is reached', async () => {
    mockDb.select
      .mockReturnValueOnce(dbChain([{ plan: 'free' }]))
      .mockReturnValueOnce(dbChain([{ publicCount: 3 }]))

    const res = await PATCH(req({ isPublic: true }), ctx())
    expect(res.status).toBe(403)
  })

  it('returns 404 when no row was updated', async () => {
    mockDb.update.mockReturnValue(dbChain([]))
    const res = await PATCH(req({ note: 'Updated' }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 500 when the DB write throws', async () => {
    mockDb.update.mockImplementation(() => {
      throw new Error('db down')
    })
    const res = await PATCH(req({ note: 'Updated' }), ctx())
    expect(res.status).toBe(500)
  })

  it('returns the updated memory on success', async () => {
    mockDb.update.mockReturnValue(dbChain([{ ...mockMemory, note: 'Updated' }]))
    const res = await PATCH(req({ note: 'Updated' }), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.note).toBe('Updated')
  })

  it('returns 500 when replacing media throws', async () => {
    mockDb.update.mockReturnValue(dbChain([mockMemory]))
    mockDb.delete.mockImplementation(() => {
      throw new Error('db down')
    })
    const res = await PATCH(req({ media: [{ url: 'https://example.com/a.jpg' }] }), ctx())
    expect(res.status).toBe(500)
  })
})

describe('DELETE /api/trips/[id]/memories/[memoryId]', () => {
  it('returns 404 when no row was deleted', async () => {
    mockDb.delete.mockReturnValue(dbChain([]))
    const res = await DELETE(new Request('http://localhost'), ctx())
    expect(res.status).toBe(404)
  })

  it('deletes the memory on success', async () => {
    mockDb.delete.mockReturnValue(dbChain([{ id: memoryId }]))
    const res = await DELETE(new Request('http://localhost'), ctx())
    expect(res.status).toBe(200)
  })
})
