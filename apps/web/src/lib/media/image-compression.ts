const MAX_DIMENSION_PX = 2000
const QUALITY = 0.8
const OUTPUT_CONTENT_TYPE = 'image/jpeg'

export interface CompressedImage {
  blob: Blob
  contentType: string
  width: number
  height: number
}

// Downsizes and re-encodes an uploaded image client-side before it ever
// reaches the network — raw phone/camera photos (12-48MP) are wildly
// oversized for display, and this is the main lever for keeping S3
// storage/bandwidth cost down (applies to every plan, not just free).
// Also does double duty as the source of `width`/`height`, since S3
// (unlike the old Cloudinary upload response) reports neither.
export async function compressImage(file: Blob): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, OUTPUT_CONTENT_TYPE, QUALITY),
    )
    if (!blob) throw new Error('Image compression failed')

    return { blob, contentType: OUTPUT_CONTENT_TYPE, width, height }
  } finally {
    bitmap.close()
  }
}
