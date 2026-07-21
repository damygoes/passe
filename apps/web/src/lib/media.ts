import { createHmac, timingSafeEqual } from 'node:crypto'

const MEDIA_ROUTE_PREFIX = '/api/media/'

const PRIVATE_TTL_SECONDS = 60 * 60 // 1 hour — re-minted on every read
const PUBLIC_TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year — owner opted in, safe to cache long

// Width buckets used to pre-mint a small set of signed URLs per image, so
// next/image's responsive srcset can request a size close to what it
// actually needs instead of always scaling down one fixed-width asset.
// 2048 is the ceiling because client-side upload compression already caps
// stored originals at ~2000px (see src/lib/image-compression.ts) — nothing
// wider ever contains more real detail, and `withoutEnlargement: true` in
// the read route already no-ops requests past the source size.
const RESPONSIVE_WIDTHS = [480, 750, 1080, 1600, 2048] as const

// Must equal the largest entry in RESPONSIVE_WIDTHS — the single resolved
// coverImageUrl/media url continues to serve the largest bucket, so any
// code path that hasn't adopted the srcset yet keeps working unchanged.
const DEFAULT_WIDTH: number = 2048
const DEFAULT_QUALITY = 75
const DEFAULT_FORMAT = 'webp'

export interface MediaSignatureParams {
  w: number
  q: number
  fm: string
  exp: number
  pub: 0 | 1
}

function getSigningSecret(): string {
  const secret = process.env.MEDIA_URL_SIGNING_SECRET
  if (!secret) throw new Error('MEDIA_URL_SIGNING_SECRET is not set')
  return secret
}

// Media URLs must be absolute, not same-origin-relative: React Native's
// Image/expo-image has no page origin to resolve a relative URL against
// (unlike a browser), so a bare "/api/media/..." path renders nothing on
// mobile even though it works fine on web. Building an absolute URL here
// costs web nothing and is required for mobile.
function getAppOrigin(): string {
  const origin = process.env.APP_URL
  if (!origin) throw new Error('APP_URL is not set')
  return origin.replace(/\/$/, '')
}

function canonicalizeParams(key: string, params: MediaSignatureParams): string {
  return `key=${key}&w=${params.w}&q=${params.q}&fm=${params.fm}&exp=${params.exp}&pub=${params.pub}`
}

export function signMediaParams(key: string, params: MediaSignatureParams): string {
  return createHmac('sha256', getSigningSecret())
    .update(canonicalizeParams(key, params))
    .digest('hex')
}

// Verifies both the signature (tamper-proof) and the expiry (time-bound).
// There is deliberately no unsigned/fallback path — every caller of
// /api/media/[...key] must supply a valid, current signature.
export function verifyMediaSignature(
  key: string,
  params: MediaSignatureParams,
  sig: string,
): boolean {
  const expected = signMediaParams(key, params)
  const expectedBuf = Buffer.from(expected, 'hex')
  const actualBuf = Buffer.from(sig, 'hex')
  if (expectedBuf.length !== actualBuf.length) return false
  if (!timingSafeEqual(expectedBuf, actualBuf)) return false
  if (Math.floor(Date.now() / 1000) > params.exp) return false
  return true
}

function isLegacyCloudinaryUrl(ref: string): boolean {
  return ref.startsWith('http')
}

function buildSignedMediaUrl(
  key: string,
  isPublic: boolean,
  width: number = DEFAULT_WIDTH,
): string {
  const ttl = isPublic ? PUBLIC_TTL_SECONDS : PRIVATE_TTL_SECONDS
  const params: MediaSignatureParams = {
    w: width,
    q: DEFAULT_QUALITY,
    fm: DEFAULT_FORMAT,
    exp: Math.floor(Date.now() / 1000) + ttl,
    pub: isPublic ? 1 : 0,
  }
  const sig = signMediaParams(key, params)
  const query = new URLSearchParams({
    w: String(params.w),
    q: String(params.q),
    fm: params.fm,
    exp: String(params.exp),
    pub: String(params.pub),
    sig,
  })
  return `${getAppOrigin()}${MEDIA_ROUTE_PREFIX}${key}?${query.toString()}`
}

// Mints one signed URL per responsive width bucket for a single media ref —
// the "pre-minted signed set" approach to responsive breakpoints: every URL
// stays fully HMAC-signed exactly like the single-URL case (no relaxation
// of what's bound into the signature), and a custom next/image loader
// (src/lib/media-image-loader.ts) picks the closest bucket at render time.
// Returns null for legacy Cloudinary rows — there's nothing to bucket, the
// URL is used as-is.
export function resolveMediaSrcset(
  ref: string | null,
  opts: { isPublic: boolean },
): Record<string, string> | null {
  if (!ref || isLegacyCloudinaryUrl(ref)) return null
  const entries = RESPONSIVE_WIDTHS.map(
    (width) => [width, buildSignedMediaUrl(ref, opts.isPublic, width)] as const,
  )
  return Object.fromEntries(entries)
}

// Resolves a stored DB value (bare S3 key, or a legacy Cloudinary URL left
// untouched by the migration) into a URL safe to hand to the client. Legacy
// Cloudinary URLs pass through unchanged. S3 keys are turned into a signed,
// time-bound /api/media/... URL — private media gets a short TTL re-minted
// on every read, public media gets a long one.
export function resolveMediaUrl(ref: string, opts: { isPublic: boolean }): string
export function resolveMediaUrl(ref: string | null, opts: { isPublic: boolean }): string | null
export function resolveMediaUrl(ref: string | null, opts: { isPublic: boolean }): string | null {
  if (!ref) return null
  if (isLegacyCloudinaryUrl(ref)) return ref
  return buildSignedMediaUrl(ref, opts.isPublic)
}

export function resolveTripMedia<T extends { coverImageUrl: string | null; isPublic: boolean }>(
  trip: T,
): T & { coverImageSrcset: Record<string, string> | null } {
  return {
    ...trip,
    coverImageUrl: resolveMediaUrl(trip.coverImageUrl, { isPublic: trip.isPublic }),
    coverImageSrcset: resolveMediaSrcset(trip.coverImageUrl, { isPublic: trip.isPublic }),
  }
}

export function resolveMemoryMedia<T extends { isPublic: boolean; media: { url: string }[] }>(
  memory: T,
): T & { media: (T['media'][number] & { srcset: Record<string, string> | null })[] } {
  return {
    ...memory,
    media: memory.media.map((item) => ({
      ...item,
      url: resolveMediaUrl(item.url, { isPublic: memory.isPublic }),
      srcset: resolveMediaSrcset(item.url, { isPublic: memory.isPublic }),
    })),
  }
}

export class MediaOwnershipError extends Error {
  constructor() {
    super('Media reference does not belong to the authenticated user')
    this.name = 'MediaOwnershipError'
  }
}

// Parses `input` as a URL (absolute, or relative to our own origin) and
// returns its path if it points at our own /api/media/ route — regardless
// of what host it claims, since only the path structure is trusted here.
// Anything that fails to parse as a URL at all (a bare S3 key has no
// scheme and isn't a valid path on its own) returns null.
function extractOwnMediaKey(input: string): string | null {
  let url: URL
  try {
    url = new URL(input, getAppOrigin())
  } catch {
    return null
  }
  if (!url.pathname.startsWith(MEDIA_ROUTE_PREFIX)) return null
  const key = url.pathname.slice(MEDIA_ROUTE_PREFIX.length)
  return key || null
}

// Canonicalizes an incoming write value (coverImageUrl, a memory photo url)
// before it's persisted. A client submitting an unchanged photo from an
// edit form sends back whatever the GET response gave it — a resolved,
// signed /api/media/... URL under this design — which must be normalized
// back to the bare key, not stored verbatim (a signed URL expires; the key
// doesn't). Also enforces that a signed URL a client submits actually
// belongs to them, closing an IDOR path a naive re-sign would open.
export function normalizeMediaRef(input: string | null | undefined, userId: string): string | null {
  if (input == null || input === '') return null

  const ownKey = extractOwnMediaKey(input)
  if (ownKey !== null) {
    if (!ownKey.startsWith(`passe/${userId}/`)) throw new MediaOwnershipError()
    return ownKey
  }

  // Legacy Cloudinary URL or an already-bare key from a fresh upload — both
  // pass through unchanged.
  return input
}
