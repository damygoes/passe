// PDF-embeddable counterpart of EditorialMemoryData (apps/web/src/features/trips/components/editorial/editorial-types.ts):
// `media` there holds resolvable URLs for <Image>; here it holds already-fetched
// image bytes, since @react-pdf/renderer needs raw data to embed in the PDF, not
// a URL a browser would load. Only images the section variant actually renders
// are resolved (see resolveSectionImages.ts) — a text-only memory carries none.
export interface PdfMemoryData {
  id: string
  note?: string | null
  city?: string | null
  country?: string | null
  capturedAt: Date | string
  images: { data: Buffer; format: 'jpg' }[]
}

export function pdfMemoryMetaLabel(memory: Pick<PdfMemoryData, 'city' | 'country'>): string {
  return [memory.city, memory.country].filter(Boolean).join(', ')
}
