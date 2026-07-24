import { randomUUID } from 'node:crypto'
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'lib/s3' } })

const UPLOAD_URL_TTL_SECONDS = 5 * 60

const ALLOWED_CONTENT_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const

export type AllowedContentType = keyof typeof ALLOWED_CONTENT_TYPES

export function isAllowedContentType(contentType: string): contentType is AllowedContentType {
  return contentType in ALLOWED_CONTENT_TYPES
}

// Lazy singleton — module can be imported in files that never touch S3 (e.g.
// during build) without requiring AWS_* env vars to be set.
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('AWS S3 env vars are not set')
    }
    s3Client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
  }
  return s3Client
}

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET_NAME
  if (!bucket) throw new Error('S3_BUCKET_NAME is not set')
  return bucket
}

export interface MintedUpload {
  key: string
  uploadUrl: string
}

// Mints a presigned S3 PUT URL for a new upload. The client uploads the raw
// file bytes directly to S3 with this URL — bytes never touch the Passé
// server. Key format (passe/<userId>/<uuid>.<ext>) mirrors the folder
// convention the previous Cloudinary integration used.
export async function mintUploadKeyAndUrl({
  userId,
  contentType,
}: {
  userId: string
  contentType: AllowedContentType
}): Promise<MintedUpload> {
  const extension = ALLOWED_CONTENT_TYPES[contentType]
  const key = `passe/${userId}/${randomUUID()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: UPLOAD_URL_TTL_SECONDS,
  })

  return { key, uploadUrl }
}

// Best-effort cleanup — the DB rows referencing these objects are already
// gone by the time this runs, so an S3 failure must never surface as an
// error to the caller; it just leaves an orphaned object, logged for
// follow-up. Mirrors deleteCloudinaryAssets' semantics in ./cloudinary.ts.
export async function deleteS3Objects(keys: string[]): Promise<void> {
  if (keys.length === 0) return

  try {
    await getS3Client().send(
      new DeleteObjectsCommand({
        Bucket: getBucketName(),
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      }),
    )
  } catch (err) {
    log.error('S3 object deletion failed', {
      keys,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export interface S3ObjectStream {
  body: ReadableStream
  contentType: string | null
}

// Fetches an object's bytes for the transform route to pipe through sharp.
// Returns null (not a throw) when the key doesn't exist, so the route can
// respond 404 without treating a missing object as a server error.
export async function getS3ObjectStream(key: string): Promise<S3ObjectStream | null> {
  try {
    const result = await getS3Client().send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: key }),
    )
    if (!result.Body) return null
    return {
      body: result.Body.transformToWebStream(),
      contentType: result.ContentType ?? null,
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'NoSuchKey') return null
    log.error('S3 object fetch failed', {
      key,
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

// Fetches an object's full bytes as a Buffer — shared by the media transform
// route and server-side placeholder generation. Returns null when the key
// doesn't exist or the fetch fails, matching getS3ObjectStream's semantics.
export async function getS3ObjectBuffer(key: string): Promise<Buffer | null> {
  const object = await getS3ObjectStream(key)
  if (!object) return null
  return streamToBuffer(object.body)
}
