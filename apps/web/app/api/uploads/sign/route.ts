import { apiError, apiSuccess, requireAuth } from '@/lib/api/api'
import { isAllowedContentType, mintUploadKeyAndUrl } from '@/lib/media/s3'
import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'api/uploads/sign' } })

// POST /api/uploads/sign
// Mints a presigned S3 PUT URL for a direct client → S3 upload. Clients PUT
// straight to S3 with this URL so image bytes never pass through our server.
export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json().catch(() => null)
  const contentType = (body as { contentType?: unknown } | null)?.contentType

  if (typeof contentType !== 'string' || !isAllowedContentType(contentType)) {
    return apiError('Unsupported content type', 400)
  }

  try {
    const { key, uploadUrl } = await mintUploadKeyAndUrl({ userId, contentType })
    log.debug('Issued upload URL', { userId, key })
    return apiSuccess({ key, uploadUrl })
  } catch (err) {
    log.error('Failed to mint upload URL', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Uploads are not configured', 500)
  }
}
