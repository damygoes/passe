import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/media', () => ({ verifyMediaSignature: vi.fn() }))
vi.mock('@/lib/s3', () => ({ getS3ObjectBuffer: vi.fn() }))

const mockToBuffer = vi.fn()
const mockWebp = vi.fn()
const mockJpeg = vi.fn()
const mockAvif = vi.fn()
const mockResize = vi.fn()

vi.mock('sharp', () => {
  const chain = {
    resize: (...args: unknown[]) => {
      mockResize(...args)
      return chain
    },
    webp: (...args: unknown[]) => {
      mockWebp(...args)
      return chain
    },
    jpeg: (...args: unknown[]) => {
      mockJpeg(...args)
      return chain
    },
    avif: (...args: unknown[]) => {
      mockAvif(...args)
      return chain
    },
    toBuffer: (...args: unknown[]) => mockToBuffer(...args),
  }
  return { default: vi.fn(() => chain) }
})

import { verifyMediaSignature } from '@/lib/media'
import { getS3ObjectBuffer } from '@/lib/s3'

function ctx(key: string[]) {
  return { params: Promise.resolve({ key }) } as never
}

function req(query: string) {
  return new Request(`http://localhost/api/media/passe/user-1/abc.jpg?${query}`)
}

const validQuery = 'w=1600&q=75&fm=webp&exp=9999999999&pub=0&sig=validsig'

beforeEach(() => {
  vi.mocked(verifyMediaSignature).mockReturnValue(true)
  vi.mocked(getS3ObjectBuffer).mockResolvedValue(Buffer.from([1, 2, 3]))
  mockToBuffer.mockResolvedValue(Buffer.from('transformed-bytes'))
})

describe('GET /api/media/[...key]', () => {
  it('returns 403 when sig is missing', async () => {
    const res = await GET(
      req('w=1600&q=75&fm=webp&exp=9999999999&pub=0'),
      ctx(['passe', 'user-1', 'abc.jpg']),
    )
    expect(res.status).toBe(403)
    expect(verifyMediaSignature).not.toHaveBeenCalled()
  })

  it('returns 403 when required params are malformed', async () => {
    const res = await GET(
      req('w=notanumber&q=75&fm=webp&exp=9999999999&pub=0&sig=x'),
      ctx(['passe', 'user-1', 'abc.jpg']),
    )
    expect(res.status).toBe(403)
  })

  it('returns 403 when pub is not 0 or 1', async () => {
    const res = await GET(
      req('w=1600&q=75&fm=webp&exp=9999999999&pub=2&sig=x'),
      ctx(['passe', 'user-1', 'abc.jpg']),
    )
    expect(res.status).toBe(403)
  })

  it('returns 403 when the signature does not verify', async () => {
    vi.mocked(verifyMediaSignature).mockReturnValue(false)
    const res = await GET(req(validQuery), ctx(['passe', 'user-1', 'abc.jpg']))
    expect(res.status).toBe(403)
  })

  it('passes the joined key to signature verification', async () => {
    await GET(req(validQuery), ctx(['passe', 'user-1', 'abc.jpg']))
    expect(verifyMediaSignature).toHaveBeenCalledWith(
      'passe/user-1/abc.jpg',
      expect.objectContaining({ w: 1600, q: 75, fm: 'webp', pub: 0 }),
      'validsig',
    )
  })

  it('returns 404 when the object does not exist in S3', async () => {
    vi.mocked(getS3ObjectBuffer).mockResolvedValue(null)
    const res = await GET(req(validQuery), ctx(['passe', 'user-1', 'abc.jpg']))
    expect(res.status).toBe(404)
  })

  it('returns a private, short-lived Cache-Control for pub=0', async () => {
    const res = await GET(req(validQuery), ctx(['passe', 'user-1', 'abc.jpg']))
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toBe('private, max-age=3600')
  })

  it('returns a public, long-lived Cache-Control for pub=1', async () => {
    const res = await GET(
      req('w=1600&q=75&fm=webp&exp=9999999999&pub=1&sig=validsig'),
      ctx(['passe', 'user-1', 'abc.jpg']),
    )
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable')
  })

  it('sets Content-Type based on the requested format', async () => {
    const res = await GET(
      req('w=1600&q=75&fm=avif&exp=9999999999&pub=0&sig=validsig'),
      ctx(['passe', 'user-1', 'abc.jpg']),
    )
    expect(res.headers.get('Content-Type')).toBe('image/avif')
    expect(mockAvif).toHaveBeenCalledWith({ quality: 75 })
  })

  it('returns 500 when the transform throws', async () => {
    mockToBuffer.mockRejectedValue(new Error('sharp exploded'))
    const res = await GET(req(validQuery), ctx(['passe', 'user-1', 'abc.jpg']))
    expect(res.status).toBe(500)
  })
})
