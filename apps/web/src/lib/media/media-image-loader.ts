import type { ImageLoader } from 'next/image'

// Builds a next/image loader for a single media item from its pre-minted
// width-bucket → signed URL map (see resolveMediaSrcset in src/lib/media.ts).
// Unlike next/image's default loader, this ignores `src`/`quality` entirely
// — every candidate URL is already fully signed with its own width and
// quality baked in, so the loader's only job is picking the closest bucket
// for whatever width Next's own responsive-image algorithm asks for.
export function createMediaLoader(urlsByWidth: Record<string, string>): ImageLoader {
  const buckets = Object.keys(urlsByWidth)
    .map(Number)
    .sort((a, b) => a - b)
  const largestBucket = buckets[buckets.length - 1]

  return ({ width }) => {
    const bucket = buckets.find((candidate) => candidate >= width) ?? largestBucket
    return bucket !== undefined ? (urlsByWidth[String(bucket)] ?? '') : ''
  }
}
