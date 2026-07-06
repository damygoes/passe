import { auth } from '@clerk/nextjs/server'
import { describe, expect, it, vi } from 'vitest'
import { apiError, apiSuccess, requireAuth } from './api'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

describe('apiError', () => {
  it('returns the message and status in a consistent shape', async () => {
    const res = apiError('Not found', 404)
    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({ error: 'Not found' })
  })
})

describe('apiSuccess', () => {
  it('defaults to status 200', async () => {
    const res = apiSuccess({ id: '1' })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ data: { id: '1' } })
  })

  it('accepts a custom status', async () => {
    const res = apiSuccess({ id: '1' }, 201)
    expect(res.status).toBe(201)
  })
})

describe('requireAuth', () => {
  it('returns the userId when signed in', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_1' } as Awaited<ReturnType<typeof auth>>)
    const result = await requireAuth()
    expect(result).toEqual({ userId: 'user_1', error: null })
  })

  it('returns a 401 response when signed out', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const result = await requireAuth()
    expect(result.userId).toBeNull()
    expect(result.error?.status).toBe(401)
    await expect(result.error?.json()).resolves.toEqual({ error: 'Unauthorised' })
  })
})
