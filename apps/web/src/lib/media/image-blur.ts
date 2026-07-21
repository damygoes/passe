// Shared prop-spread helper for next/image blur-up placeholders. Media
// created before the placeholder column existed (or legacy Cloudinary rows)
// has no placeholder — this returns an empty object in that case so the
// <Image> gets neither prop and falls back to Next's default "empty"
// placeholder, rather than a broken `placeholder="blur"` with no
// `blurDataURL`.
export function getBlurProps(placeholder: string | null | undefined) {
  return placeholder ? ({ placeholder: 'blur' as const, blurDataURL: placeholder } as const) : {}
}
