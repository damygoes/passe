import { createHash } from 'node:crypto'
import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'api/uploads/sign' } })

// POST /api/uploads/sign
// Returns a short-lived signature for a direct client → Cloudinary upload.
// Clients upload straight to Cloudinary with these params so image bytes
// never pass through our server.
export async function POST() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    log.error('Cloudinary env vars missing')
    return apiError('Uploads are not configured', 500)
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = `passe/${userId}`

  // Cloudinary signature: SHA-1 of the signed params sorted alphabetically,
  // concatenated as a query string, with the API secret appended.
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(toSign).digest('hex')

  log.debug('Issued upload signature', { userId })

  return apiSuccess({ cloudName, apiKey, timestamp, signature, folder })
}
