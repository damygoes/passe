import type { EditorialChapter, EditorialMemoryInput, EditorialSectionVariant } from '@passe/utils'
import sharp from 'sharp'
import { getS3ObjectBuffer } from '@/lib/media/s3'
import type { PdfMemoryData } from './pdf-types'

// Keeps the generated PDF a reasonable size — print/screen viewing doesn't
// need the full ~2000px originals client-side compression already caps
// uploads at (see apps/web/src/lib/image-compression.ts).
const PDF_IMAGE_WIDTH = 1200
const PDF_IMAGE_QUALITY = 82

// A static grid can't show every photo the way the web carousel's horizontal
// scroll can — cap to keep the layout to a clean 2x2.
const MAX_GRID_IMAGES = 4

function isLegacyCloudinaryUrl(ref: string): boolean {
  return ref.startsWith('http')
}

async function fetchRawBytes(ref: string): Promise<Buffer | null> {
  if (isLegacyCloudinaryUrl(ref)) {
    const res = await fetch(ref)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  }
  return getS3ObjectBuffer(ref)
}

// Exported for the trip cover image (generateTripPdf.ts) — same fetch +
// resize pipeline, just not tied to a specific section variant.
export async function loadPdfImage(ref: string): Promise<{ data: Buffer; format: 'jpg' } | null> {
  const raw = await fetchRawBytes(ref)
  if (!raw) return null
  const data = await sharp(raw)
    .rotate()
    .resize({ width: PDF_IMAGE_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: PDF_IMAGE_QUALITY })
    .toBuffer()
  return { data, format: 'jpg' }
}

function imageCountForVariant(variant: EditorialSectionVariant): number {
  switch (variant) {
    case 'hero':
    case 'imageLeft':
    case 'imageRight':
      return 1
    case 'carousel':
      return MAX_GRID_IMAGES
    case 'text':
      return 0
  }
}

async function resolvePdfMemory(
  memory: EditorialMemoryInput,
  variant: EditorialSectionVariant,
): Promise<PdfMemoryData> {
  const wanted = memory.media.slice(0, imageCountForVariant(variant))
  const loaded = await Promise.all(wanted.map((item) => loadPdfImage(item.url)))

  return {
    id: memory.id,
    note: memory.note,
    city: memory.city,
    country: memory.country,
    capturedAt: memory.capturedAt,
    images: loaded.filter((image) => image !== null),
  }
}

export interface PdfChapter {
  key: string
  title: string
  subtitle?: string
  sections: { memory: PdfMemoryData; variant: EditorialSectionVariant }[]
}

// Resolves only the images each section's editorial layout actually renders
// (buildEditorialChapters from @passe/utils has already decided hero vs.
// imageLeft vs. carousel etc. — this is a second, PDF-specific rendering
// target for the same chapter data the web trip page uses).
export async function resolveSectionImages(
  chapters: EditorialChapter<EditorialMemoryInput>[],
): Promise<PdfChapter[]> {
  return Promise.all(
    chapters.map(async (chapter) => ({
      key: chapter.key,
      title: chapter.title,
      subtitle: chapter.subtitle,
      sections: await Promise.all(
        chapter.sections.map(async ({ memory, variant }) => ({
          memory: await resolvePdfMemory(memory, variant),
          variant,
        })),
      ),
    })),
  )
}
