import { createHash } from 'node:crypto'
import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'lib/cloudinary' } })

export type CloudinaryResourceType = 'image' | 'video'

export interface CloudinaryAssetRef {
  url: string
  resourceType: CloudinaryResourceType
}

// Our upload flow never applies transformations, so the public_id is exactly
// the path segment between the (optional) version and the file extension —
// it already embeds the `passe/<userId>/` folder prefix Cloudinary returns.
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^./]+$/)
  return match?.[1] ?? null
}

async function destroyAsset({ url, resourceType }: CloudinaryAssetRef): Promise<void> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    log.error('Cloudinary env vars missing, skipping asset deletion', { url })
    return
  }

  const publicId = extractPublicId(url)
  if (!publicId) {
    log.error('Could not extract Cloudinary public_id from URL', { url })
    return
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(toSign).digest('hex')

  const form = new FormData()
  form.append('public_id', publicId)
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    log.error('Cloudinary asset deletion failed', { url, publicId, status: res.status, body })
  }
}

// Best-effort cleanup — the DB rows referencing these assets are already
// gone by the time this runs, so a Cloudinary failure must never surface as
// an error to the caller; it just leaves an orphaned asset, logged for
// follow-up.
export async function deleteCloudinaryAssets(assets: CloudinaryAssetRef[]): Promise<void> {
  if (assets.length === 0) return
  await Promise.allSettled(assets.map(destroyAsset))
}
