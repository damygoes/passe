import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PATCH } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockDb = vi.hoisted(() => ({
  query: { trips: { findFirst: vi.fn() } },
  execute: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

const tripId = '11111111-1111-1111-1111-111111111111'
const memoryId = '22222222-2222-2222-2222-222222222222'

function ctx() {
  return { params: Promise.resolve({ id: tripId }) } as never
}

function req(body: unknown) {
  return new Request(`http://localhost/api/trips/${tripId}/memories/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('PATCH /api/trips/[id]/memories/reorder', () => {
  it('returns 404 when the trip does not belong to the user', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue(undefined)
    const res = await PATCH(req({ orderedIds: [memoryId] }), ctx())
    expect(res.status).toBe(404)
  })

  it('returns 400 on an invalid body', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue({ id: tripId, userId: 'user-1' })
    const res = await PATCH(req({ orderedIds: [] }), ctx())
    expect(res.status).toBe(400)
  })

  it('returns 500 when the bulk update throws', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue({ id: tripId, userId: 'user-1' })
    mockDb.execute.mockRejectedValue(new Error('db down'))
    const res = await PATCH(req({ orderedIds: [memoryId] }), ctx())
    expect(res.status).toBe(500)
  })

  it('persists the new order on success', async () => {
    mockDb.query.trips.findFirst.mockResolvedValue({ id: tripId, userId: 'user-1' })
    mockDb.execute.mockResolvedValue(undefined)
    const res = await PATCH(req({ orderedIds: [memoryId] }), ctx())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual({ tripId, count: 1 })
  })
})
