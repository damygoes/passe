import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { compressImage } from './image-compression'

// This file runs in the vitest "api" project (real Node, no DOM) per
// vitest.config.ts — src/lib/**/*.test.ts is excluded from the happy-dom
// "unit" project. There is no real createImageBitmap/canvas available
// either way (happy-dom's canvas support is partial at best), so these
// tests stub the browser APIs directly and assert the function's contract
// (dimensions, format, quality, cleanup) rather than real pixel output.
let mockBitmapWidth = 4000
let mockBitmapHeight = 3000
const mockBitmapClose = vi.fn()
const mockToBlob = vi.fn()
const mockDrawImage = vi.fn()

beforeEach(() => {
  mockBitmapWidth = 4000
  mockBitmapHeight = 3000

  vi.stubGlobal(
    'createImageBitmap',
    vi.fn().mockImplementation(async () => ({
      get width() {
        return mockBitmapWidth
      },
      get height() {
        return mockBitmapHeight
      },
      close: mockBitmapClose,
    })),
  )

  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ({ drawImage: mockDrawImage })),
    toBlob: mockToBlob,
  }
  vi.stubGlobal('document', { createElement: vi.fn(() => mockCanvas) })

  mockToBlob.mockImplementation((cb: (blob: Blob | null) => void, type: string, quality: number) =>
    cb({ type, quality } as unknown as Blob),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('compressImage', () => {
  it('downscales to the max dimension while preserving aspect ratio', async () => {
    const result = await compressImage(new Blob())
    expect(result.width).toBe(2000)
    expect(result.height).toBe(1500)
  })

  it('does not upscale an image already under the max dimension', async () => {
    mockBitmapWidth = 800
    mockBitmapHeight = 600
    const result = await compressImage(new Blob())
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
  })

  it('encodes as jpeg at the configured quality', async () => {
    const result = await compressImage(new Blob())
    expect(result.contentType).toBe('image/jpeg')
    expect(mockToBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8)
  })

  it('releases the decoded bitmap after use', async () => {
    await compressImage(new Blob())
    expect(mockBitmapClose).toHaveBeenCalled()
  })

  it('releases the bitmap even when encoding throws', async () => {
    mockToBlob.mockImplementation((cb: (blob: Blob | null) => void) => cb(null))
    await expect(compressImage(new Blob())).rejects.toThrow(/compression failed/i)
    expect(mockBitmapClose).toHaveBeenCalled()
  })

  it('throws when the canvas produces no blob', async () => {
    mockToBlob.mockImplementation((cb: (blob: Blob | null) => void) => cb(null))
    await expect(compressImage(new Blob())).rejects.toThrow(/compression failed/i)
  })
})
