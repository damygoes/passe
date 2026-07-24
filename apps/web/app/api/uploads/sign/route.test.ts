import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))
vi.mock('@/lib/media/s3', () => ({
  isAllowedContentType: vi.fn((contentType: string) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(contentType),
  ),
  mintUploadKeyAndUrl: vi.fn(),
}))

import { mintUploadKeyAndUrl } from '@/lib/media/s3'

function req(body: unknown) {
  return new Request('http://localhost/api/uploads/sign', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
  vi.mocked(mintUploadKeyAndUrl).mockResolvedValue({
    key: 'passe/user-1/abc.jpg',
    uploadUrl: 'https://s3.mock/presigned-put',
  })
})

describe('POST /api/uploads/sign', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req({ contentType: 'image/jpeg' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for an unsupported content type', async () => {
    const res = await POST(req({ contentType: 'video/mp4' }))
    expect(res.status).toBe(400)
    expect(mintUploadKeyAndUrl).not.toHaveBeenCalled()
  })

  it('returns 400 when contentType is missing or not a string', async () => {
    const res = await POST(req({}))
    expect(res.status).toBe(400)
  })

  it('returns 500 when minting the upload URL fails', async () => {
    vi.mocked(mintUploadKeyAndUrl).mockRejectedValue(new Error('AWS env vars are not set'))
    const res = await POST(req({ contentType: 'image/jpeg' }))
    expect(res.status).toBe(500)
  })

  it('returns a key scoped to the user and the presigned upload URL', async () => {
    const res = await POST(req({ contentType: 'image/jpeg' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.key).toBe('passe/user-1/abc.jpg')
    expect(body.data.uploadUrl).toBe('https://s3.mock/presigned-put')
    expect(mintUploadKeyAndUrl).toHaveBeenCalledWith({
      userId: 'user-1',
      contentType: 'image/jpeg',
    })
  })
})
