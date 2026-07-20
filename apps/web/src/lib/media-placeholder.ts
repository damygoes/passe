import { createLogger } from '@passe/logger'
import sharp from 'sharp'
import { getS3ObjectBuffer } from '@/lib/s3'

const log = createLogger({ context: { module: 'lib/media-placeholder' } })

const PLACEHOLDER_WIDTH = 20
const PLACEHOLDER_QUALITY = 40

function isLegacyCloudinaryUrl(ref: string): boolean {
  return ref.startsWith('http')
}

// Generates a tiny base64 JPEG data URI from a freshly uploaded S3 object,
// for use as next/image's blurDataURL. Best-effort: a failure here (S3
// fetch error, corrupt/undecodable image) must never block the trip/memory
// write it's called from, so every failure path returns null rather than
// throwing. Skips legacy Cloudinary rows (full URLs, not our S3 keys) since
// those predate this feature and aren't fetched through our S3 client.
export async function generateMediaPlaceholder(key: string): Promise<string | null> {
  if (isLegacyCloudinaryUrl(key)) return null

  try {
    const input = await getS3ObjectBuffer(key)
    if (!input) return null

    const output = await sharp(input)
      .resize({ width: PLACEHOLDER_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: PLACEHOLDER_QUALITY })
      .toBuffer()

    return `data:image/jpeg;base64,${output.toString('base64')}`
  } catch (err) {
    log.error('Placeholder generation failed', {
      key,
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}
