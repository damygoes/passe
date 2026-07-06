import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DELETE, GET, PATCH } from './route'

const mockClerkClient = vi.hoisted(() => ({
  users: { updateUser: vi.fn(), deleteUser: vi.fn() },
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  clerkClient: vi.fn().mockResolvedValue(mockClerkClient),
}))

const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
  update: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

const mockUser = {
  id: 'user-1',
  email: 'user@example.com',
  username: 'traveler',
  displayName: 'Traveler',
  bio: null,
  avatarUrl: null,
  plan: 'free',
  createdAt: new Date(),
  updatedAt: new Date(),
}

function patchReq(body: unknown) {
  return new Request('http://localhost/api/user', { method: 'PATCH', body: JSON.stringify(body) })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('GET /api/user', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 404 when the user row does not exist', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await GET()
    expect(res.status).toBe(404)
  })

  it('returns the user on success', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(mockUser)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.username).toBe('traveler')
  })
})

describe('PATCH /api/user', () => {
  it('returns 400 on an invalid body', async () => {
    const res = await PATCH(patchReq({ username: 'a' }))
    expect(res.status).toBe(400)
  })

  it('returns 409 when the username is already taken by another user', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ ...mockUser, id: 'user-2' })
    const res = await PATCH(patchReq({ username: 'taken' }))
    expect(res.status).toBe(409)
  })

  it('returns 500 when the Clerk sync fails', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    mockClerkClient.users.updateUser.mockRejectedValue(new Error('clerk down'))
    const res = await PATCH(patchReq({ displayName: 'New Name' }))
    expect(res.status).toBe(500)
  })

  it('updates the user on success', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    mockClerkClient.users.updateUser.mockResolvedValue({})
    mockDb.update.mockReturnValue(dbChain([{ ...mockUser, displayName: 'New Name' }]))

    const res = await PATCH(patchReq({ displayName: 'New Name' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.displayName).toBe('New Name')
  })
})

describe('DELETE /api/user', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await DELETE()
    expect(res.status).toBe(401)
  })

  it('deletes the Clerk account on success', async () => {
    mockClerkClient.users.deleteUser.mockResolvedValue({})
    const res = await DELETE()
    expect(res.status).toBe(200)
  })

  it('returns 500 when Clerk deletion fails', async () => {
    mockClerkClient.users.deleteUser.mockRejectedValue(new Error('clerk down'))
    const res = await DELETE()
    expect(res.status).toBe(500)
  })
})
