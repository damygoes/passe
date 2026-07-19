import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

const MAX_DIMENSION_PX = 2000
const QUALITY = 0.8

export interface CompressedImage {
  uri: string
  contentType: string
  width: number
  height: number
}

// Downsizes and re-encodes a picked/captured photo before it ever reaches
// the network — raw phone photos (12-48MP) are wildly oversized for
// display, and this is the main lever for keeping S3 storage/bandwidth
// cost down (applies to every plan, not just free). Only resizes when the
// source is actually larger than the target — expo-image-manipulator's
// resize action does not itself skip upscaling.
export async function compressImage(asset: {
  uri: string
  width: number
  height: number
}): Promise<CompressedImage> {
  const needsResize = Math.max(asset.width, asset.height) > MAX_DIMENSION_PX
  const actions = needsResize ? [{ resize: { width: MAX_DIMENSION_PX } }] : []

  const result = await manipulateAsync(asset.uri, actions, {
    compress: QUALITY,
    format: SaveFormat.JPEG,
  })

  return { uri: result.uri, contentType: 'image/jpeg', width: result.width, height: result.height }
}
