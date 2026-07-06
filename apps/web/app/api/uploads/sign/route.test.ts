import { auth } from '@clerk/nextjs/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
  vi.stubEnv('CLOUDINARY_CLOUD_NAME', 'demo')
  vi.stubEnv('CLOUDINARY_API_KEY', 'key123')
  vi.stubEnv('CLOUDINARY_API_SECRET', 'secret123')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/uploads/sign', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST()
    expect(res.status).toBe(401)
  })

  it('returns 500 when Cloudinary env vars are missing', async () => {
    vi.stubEnv('CLOUDINARY_CLOUD_NAME', '')
    const res = await POST()
    expect(res.status).toBe(500)
  })

  it('returns a signature scoped to the user’s folder', async () => {
    const res = await POST()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.cloudName).toBe('demo')
    expect(body.data.apiKey).toBe('key123')
    expect(body.data.folder).toBe('passe/user-1')
    expect(typeof body.data.signature).toBe('string')
    expect(body.data.signature).toHaveLength(40) // sha1 hex digest
  })
})
