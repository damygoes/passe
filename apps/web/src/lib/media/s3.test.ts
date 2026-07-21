import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockSend = vi.fn()
// Regular functions, not arrow functions — vi.fn().mockImplementation() needs
// a constructible function to support `new PutObjectCommand(...)` etc.
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(function S3ClientMock() {
    return { send: mockSend }
  }),
  PutObjectCommand: vi.fn().mockImplementation(function PutObjectCommandMock(input) {
    return { input, __type: 'PutObjectCommand' }
  }),
  GetObjectCommand: vi.fn().mockImplementation(function GetObjectCommandMock(input) {
    return { input, __type: 'GetObjectCommand' }
  }),
  DeleteObjectsCommand: vi.fn().mockImplementation(function DeleteObjectsCommandMock(input) {
    return { input, __type: 'DeleteObjectsCommand' }
  }),
}))

const mockGetSignedUrl = vi.fn()
vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args: unknown[]) => mockGetSignedUrl(...args),
}))

const { deleteS3Objects, getS3ObjectStream, isAllowedContentType, mintUploadKeyAndUrl } =
  await import('./s3')

beforeEach(() => {
  vi.stubEnv('AWS_REGION', 'us-east-1')
  vi.stubEnv('AWS_ACCESS_KEY_ID', 'AKIA_MOCK')
  vi.stubEnv('AWS_SECRET_ACCESS_KEY', 'secret_mock')
  vi.stubEnv('S3_BUCKET_NAME', 'passe-media-test')
  mockGetSignedUrl.mockResolvedValue('https://s3.mock/presigned-put')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('isAllowedContentType', () => {
  it('accepts jpeg, png, and webp', () => {
    expect(isAllowedContentType('image/jpeg')).toBe(true)
    expect(isAllowedContentType('image/png')).toBe(true)
    expect(isAllowedContentType('image/webp')).toBe(true)
  })

  it('rejects anything else, including video', () => {
    expect(isAllowedContentType('image/gif')).toBe(false)
    expect(isAllowedContentType('video/mp4')).toBe(false)
    expect(isAllowedContentType('application/octet-stream')).toBe(false)
  })
})

describe('mintUploadKeyAndUrl', () => {
  it('mints a key scoped to the user folder with the right extension', async () => {
    const { key } = await mintUploadKeyAndUrl({ userId: 'user-1', contentType: 'image/jpeg' })
    expect(key).toMatch(
      /^passe\/user-1\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/,
    )
  })

  it('returns the presigned URL from the AWS SDK', async () => {
    const { uploadUrl } = await mintUploadKeyAndUrl({ userId: 'user-1', contentType: 'image/png' })
    expect(uploadUrl).toBe('https://s3.mock/presigned-put')
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ input: expect.objectContaining({ ContentType: 'image/png' }) }),
      expect.objectContaining({ expiresIn: expect.any(Number) }),
    )
  })

  it('throws when AWS env vars are missing', async () => {
    // The S3 client is a lazy singleton cached at module scope — reset the
    // module so this test observes a fresh (not-yet-constructed) client,
    // otherwise an earlier test's successful client creation would still be
    // cached and this env var would never be re-checked.
    vi.stubEnv('AWS_ACCESS_KEY_ID', '')
    vi.resetModules()
    const fresh = await import('./s3')
    await expect(
      fresh.mintUploadKeyAndUrl({ userId: 'user-1', contentType: 'image/jpeg' }),
    ).rejects.toThrow(/not set/)
  })
})

describe('deleteS3Objects', () => {
  it('does nothing for an empty key list', async () => {
    await deleteS3Objects([])
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('sends a single batch delete for the given keys', async () => {
    mockSend.mockResolvedValue({})
    await deleteS3Objects(['passe/user-1/a.jpg', 'passe/user-1/b.jpg'])
    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Delete: { Objects: [{ Key: 'passe/user-1/a.jpg' }, { Key: 'passe/user-1/b.jpg' }] },
        }),
      }),
    )
  })

  it('swallows errors so callers are never blocked', async () => {
    mockSend.mockRejectedValue(new Error('s3 down'))
    await expect(deleteS3Objects(['passe/user-1/a.jpg'])).resolves.toBeUndefined()
  })
})

describe('getS3ObjectStream', () => {
  it('returns the body stream and content type on success', async () => {
    const fakeStream = new ReadableStream()
    mockSend.mockResolvedValue({
      Body: { transformToWebStream: () => fakeStream },
      ContentType: 'image/jpeg',
    })

    const result = await getS3ObjectStream('passe/user-1/a.jpg')

    expect(result).toEqual({ body: fakeStream, contentType: 'image/jpeg' })
  })

  it('returns null when the SDK response has no body', async () => {
    mockSend.mockResolvedValue({ Body: undefined })
    const result = await getS3ObjectStream('passe/user-1/missing.jpg')
    expect(result).toBeNull()
  })

  it('returns null (not a throw) when the object does not exist', async () => {
    const error = new Error('not found')
    error.name = 'NoSuchKey'
    mockSend.mockRejectedValue(error)

    const result = await getS3ObjectStream('passe/user-1/missing.jpg')

    expect(result).toBeNull()
  })
})
