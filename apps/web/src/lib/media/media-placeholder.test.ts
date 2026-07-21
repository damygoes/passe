import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./s3', () => ({ getS3ObjectBuffer: vi.fn() }))

const mockToBuffer = vi.fn()
const mockJpeg = vi.fn()
const mockResize = vi.fn()

vi.mock('sharp', () => {
  const chain = {
    resize: (...args: unknown[]) => {
      mockResize(...args)
      return chain
    },
    jpeg: (...args: unknown[]) => {
      mockJpeg(...args)
      return chain
    },
    toBuffer: (...args: unknown[]) => mockToBuffer(...args),
  }
  return { default: vi.fn(() => chain) }
})

import { getS3ObjectBuffer } from './s3'
import { generateMediaPlaceholder } from './media-placeholder'

beforeEach(() => {
  vi.mocked(getS3ObjectBuffer)
    .mockReset()
    .mockResolvedValue(Buffer.from([1, 2, 3]))
  mockToBuffer.mockReset().mockResolvedValue(Buffer.from('tiny-jpeg-bytes'))
})

describe('generateMediaPlaceholder', () => {
  it('returns a base64 data URI on success', async () => {
    const result = await generateMediaPlaceholder('passe/user-1/abc.jpg')
    expect(result).toBe(
      `data:image/jpeg;base64,${Buffer.from('tiny-jpeg-bytes').toString('base64')}`,
    )
    expect(mockResize).toHaveBeenCalledWith(expect.objectContaining({ withoutEnlargement: true }))
  })

  it('returns null without touching S3 for a legacy Cloudinary URL', async () => {
    const result = await generateMediaPlaceholder(
      'https://res.cloudinary.com/demo/image/upload/v1/passe/user-1/abc.jpg',
    )
    expect(result).toBeNull()
    expect(getS3ObjectBuffer).not.toHaveBeenCalled()
  })

  it('returns null when the S3 object cannot be fetched', async () => {
    vi.mocked(getS3ObjectBuffer).mockResolvedValue(null)
    const result = await generateMediaPlaceholder('passe/user-1/missing.jpg')
    expect(result).toBeNull()
  })

  it('returns null (never throws) when the sharp pipeline fails', async () => {
    mockToBuffer.mockRejectedValue(new Error('sharp exploded'))
    const result = await generateMediaPlaceholder('passe/user-1/corrupt.jpg')
    expect(result).toBeNull()
  })
})
