import { createLogger } from '@passe/logger'
import sharp from 'sharp'
import type { MediaSignatureParams } from '@/lib/media'
import { verifyMediaSignature } from '@/lib/media'
import { getS3ObjectBuffer } from '@/lib/s3'

// sharp is a native binary — incompatible with the Edge runtime.
export const runtime = 'nodejs'

const log = createLogger({ context: { module: 'api/media' } })

// GET /api/media/<key>?w=..&q=..&fm=..&exp=..&pub=..&sig=..
//
// The only way media is ever served. Every request must carry a valid,
// non-expired signature minted by resolveMediaUrl() in src/lib/media.ts —
// there is no unsigned fallback. This is the mechanism that closes the
// privacy gap the old Cloudinary integration had: private media gets a
// short-lived signed URL re-minted on every read, so a leaked URL expires
// instead of staying permanently public.
function parseParams(searchParams: URLSearchParams): MediaSignatureParams | null {
  const w = Number(searchParams.get('w'))
  const q = Number(searchParams.get('q'))
  const fm = searchParams.get('fm')
  const exp = Number(searchParams.get('exp'))
  const pubRaw = searchParams.get('pub')

  if (!Number.isFinite(w) || !Number.isFinite(q) || !Number.isFinite(exp)) return null
  if (!fm || (pubRaw !== '0' && pubRaw !== '1')) return null

  return { w, q, fm, exp, pub: pubRaw === '1' ? 1 : 0 }
}

function contentTypeForFormat(fm: string): string {
  if (fm === 'avif') return 'image/avif'
  if (fm === 'jpeg') return 'image/jpeg'
  return 'image/webp'
}

type SharpInstance = ReturnType<typeof sharp>

function applyFormat(pipeline: SharpInstance, fm: string, quality: number): SharpInstance {
  if (fm === 'avif') return pipeline.avif({ quality })
  if (fm === 'jpeg') return pipeline.jpeg({ quality })
  return pipeline.webp({ quality })
}

export async function GET(req: Request, ctx: RouteContext<'/api/media/[...key]'>) {
  const { key: keySegments } = await ctx.params
  const key = keySegments.join('/')

  const { searchParams } = new URL(req.url)
  const sig = searchParams.get('sig')
  const params = parseParams(searchParams)

  if (!sig || !params || !verifyMediaSignature(key, params, sig)) {
    return new Response('Forbidden', { status: 403 })
  }

  const input = await getS3ObjectBuffer(key)
  if (!input) {
    return new Response('Not found', { status: 404 })
  }

  const cacheControl =
    params.pub === 1 ? 'public, max-age=31536000, immutable' : 'private, max-age=3600'

  try {
    const pipeline = applyFormat(
      sharp(input).resize({ width: params.w, withoutEnlargement: true }),
      params.fm,
      params.q,
    )
    const output = await pipeline.toBuffer()

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        'Content-Type': contentTypeForFormat(params.fm),
        'Cache-Control': cacheControl,
      },
    })
  } catch (err) {
    log.error('Image transform failed', {
      key,
      error: err instanceof Error ? err.message : String(err),
    })
    return new Response('Internal server error', { status: 500 })
  }
}
