import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { vi } from 'vitest'
import {
  MediaOwnershipError,
  normalizeMediaRef,
  resolveMediaSrcset,
  resolveMediaUrl,
  resolveMemoryMedia,
  resolveTripMedia,
  signMediaParams,
  verifyMediaSignature,
} from './media'

beforeEach(() => {
  vi.stubEnv('MEDIA_URL_SIGNING_SECRET', 'test-secret')
  vi.stubEnv('APP_URL', 'http://localhost:3000')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('resolveMediaUrl', () => {
  it('returns null for a null ref', () => {
    expect(resolveMediaUrl(null, { isPublic: false })).toBeNull()
  })

  it('passes a legacy Cloudinary URL through unchanged', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/passe/user-1/abc.jpg'
    expect(resolveMediaUrl(url, { isPublic: false })).toBe(url)
  })

  it('builds an absolute signed URL for a bare S3 key', () => {
    const resolved = resolveMediaUrl('passe/user-1/abc.jpg', { isPublic: false })
    // Absolute, not same-origin-relative — mobile's Image component has no
    // page origin to resolve a relative URL against the way a browser does.
    expect(resolved).toMatch(/^http:\/\/localhost:3000\/api\/media\/passe\/user-1\/abc\.jpg\?/)
    const query = new URLSearchParams(resolved!.split('?')[1])
    expect(query.get('pub')).toBe('0')
    expect(query.get('sig')).toBeTruthy()
  })

  it('marks public media with pub=1 and a far-future expiry', () => {
    const resolved = resolveMediaUrl('passe/user-1/abc.jpg', { isPublic: true })
    const query = new URLSearchParams(resolved!.split('?')[1])
    expect(query.get('pub')).toBe('1')

    const now = Math.floor(Date.now() / 1000)
    expect(Number(query.get('exp'))).toBeGreaterThan(now + 60 * 60 * 24 * 30)
  })

  it('gives private media a short (~1hr) expiry, not a long one', () => {
    const resolved = resolveMediaUrl('passe/user-1/abc.jpg', { isPublic: false })
    const query = new URLSearchParams(resolved!.split('?')[1])

    const now = Math.floor(Date.now() / 1000)
    const exp = Number(query.get('exp'))
    expect(exp).toBeGreaterThan(now)
    expect(exp).toBeLessThanOrEqual(now + 60 * 60 + 5)
  })
})

describe('resolveTripMedia / resolveMemoryMedia', () => {
  it('resolves a trip cover image using the trip isPublic flag', () => {
    const trip = { id: 't1', coverImageUrl: 'passe/user-1/cover.jpg', isPublic: true }
    const resolved = resolveTripMedia(trip)
    expect(resolved.coverImageUrl).toMatch(/^http:\/\/localhost:3000\/api\/media\//)
  })

  it('leaves a null cover image as null', () => {
    const trip = { id: 't1', coverImageUrl: null, isPublic: false }
    expect(resolveTripMedia(trip).coverImageUrl).toBeNull()
  })

  it('attaches a coverImageSrcset alongside the resolved cover URL', () => {
    const trip = { id: 't1', coverImageUrl: 'passe/user-1/cover.jpg', isPublic: true }
    const resolved = resolveTripMedia(trip)
    expect(resolved.coverImageSrcset).not.toBeNull()
    expect(Object.keys(resolved.coverImageSrcset!).length).toBeGreaterThan(1)
  })

  it('has a null coverImageSrcset when there is no cover image', () => {
    const trip = { id: 't1', coverImageUrl: null, isPublic: false }
    expect(resolveTripMedia(trip).coverImageSrcset).toBeNull()
  })

  it('resolves every media item using the memory isPublic flag', () => {
    const memory = {
      id: 'm1',
      isPublic: false,
      media: [
        { id: 'a', url: 'passe/user-1/a.jpg' },
        { id: 'b', url: 'passe/user-1/b.jpg' },
      ],
    }
    const resolved = resolveMemoryMedia(memory)
    expect(resolved.media).toHaveLength(2)
    for (const item of resolved.media) {
      expect(item.url).toMatch(/^http:\/\/localhost:3000\/api\/media\/.*pub=0/)
      expect(item.srcset).not.toBeNull()
    }
  })
})

describe('resolveMediaSrcset', () => {
  it('returns null for a null ref', () => {
    expect(resolveMediaSrcset(null, { isPublic: false })).toBeNull()
  })

  it('returns null for a legacy Cloudinary URL', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/passe/user-1/abc.jpg'
    expect(resolveMediaSrcset(url, { isPublic: false })).toBeNull()
  })

  it('mints one signed URL per responsive width bucket', () => {
    const srcset = resolveMediaSrcset('passe/user-1/abc.jpg', { isPublic: false })
    expect(srcset).not.toBeNull()
    const widths = Object.keys(srcset!).map(Number)
    expect(widths).toEqual([480, 750, 1080, 1600, 2048])
    for (const [width, url] of Object.entries(srcset!)) {
      expect(url).toMatch(new RegExp(`[?&]w=${width}(&|$)`))
    }
  })

  it('every bucket URL carries its own valid signature', () => {
    const srcset = resolveMediaSrcset('passe/user-1/abc.jpg', { isPublic: true })!
    for (const url of Object.values(srcset)) {
      const query = new URLSearchParams(url.split('?')[1])
      const params = {
        w: Number(query.get('w')),
        q: Number(query.get('q')),
        fm: query.get('fm')!,
        exp: Number(query.get('exp')),
        pub: query.get('pub') === '1' ? (1 as const) : (0 as const),
      }
      expect(verifyMediaSignature('passe/user-1/abc.jpg', params, query.get('sig')!)).toBe(true)
    }
  })
})

describe('signMediaParams / verifyMediaSignature', () => {
  const params = {
    w: 1600,
    q: 75,
    fm: 'webp',
    exp: Math.floor(Date.now() / 1000) + 3600,
    pub: 0 as const,
  }

  it('round-trips: a freshly signed set of params verifies successfully', () => {
    const sig = signMediaParams('passe/user-1/a.jpg', params)
    expect(verifyMediaSignature('passe/user-1/a.jpg', params, sig)).toBe(true)
  })

  it('rejects when any param is tampered with after signing', () => {
    const sig = signMediaParams('passe/user-1/a.jpg', params)
    expect(verifyMediaSignature('passe/user-1/a.jpg', { ...params, w: 2000 }, sig)).toBe(false)
  })

  it('rejects when the key does not match what was signed', () => {
    const sig = signMediaParams('passe/user-1/a.jpg', params)
    expect(verifyMediaSignature('passe/user-1/b.jpg', params, sig)).toBe(false)
  })

  it('rejects an expired signature even if untampered', () => {
    const expired = { ...params, exp: Math.floor(Date.now() / 1000) - 10 }
    const sig = signMediaParams('passe/user-1/a.jpg', expired)
    expect(verifyMediaSignature('passe/user-1/a.jpg', expired, sig)).toBe(false)
  })

  it('rejects a garbage signature', () => {
    expect(verifyMediaSignature('passe/user-1/a.jpg', params, 'not-a-real-signature')).toBe(false)
  })
})

describe('normalizeMediaRef', () => {
  it('returns null for null/undefined/empty input', () => {
    expect(normalizeMediaRef(null, 'user-1')).toBeNull()
    expect(normalizeMediaRef(undefined, 'user-1')).toBeNull()
    expect(normalizeMediaRef('', 'user-1')).toBeNull()
  })

  it('passes a legacy Cloudinary URL through unchanged', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/passe/user-1/abc.jpg'
    expect(normalizeMediaRef(url, 'user-1')).toBe(url)
  })

  it('passes an already-bare key through unchanged', () => {
    expect(normalizeMediaRef('passe/user-1/abc.jpg', 'user-1')).toBe('passe/user-1/abc.jpg')
  })

  it('extracts the bare key from a signed /api/media/ URL owned by the caller', () => {
    const signed = resolveMediaUrl('passe/user-1/abc.jpg', { isPublic: false })!
    expect(normalizeMediaRef(signed, 'user-1')).toBe('passe/user-1/abc.jpg')
  })

  it('throws MediaOwnershipError when the signed URL belongs to a different user', () => {
    const signed = resolveMediaUrl('passe/user-1/abc.jpg', { isPublic: false })!
    expect(() => normalizeMediaRef(signed, 'user-2')).toThrow(MediaOwnershipError)
  })

  it('recognizes an own-media URL by path regardless of host', () => {
    const foreignHost = 'https://evil.example.com/api/media/passe/user-1/abc.jpg?w=1600'
    // Still extracts by path and still enforces ownership — the host is
    // never trusted, only the path structure and the userId prefix.
    expect(normalizeMediaRef(foreignHost, 'user-1')).toBe('passe/user-1/abc.jpg')
    expect(() => normalizeMediaRef(foreignHost, 'user-2')).toThrow(MediaOwnershipError)
  })
})
