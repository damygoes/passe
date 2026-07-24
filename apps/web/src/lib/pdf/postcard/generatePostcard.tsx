import { renderToBuffer } from '@react-pdf/renderer'
import { registerPdfFonts } from '../fonts'
import { loadPdfImage } from '../resolveSectionImages'
import { PostcardDocument } from './PostcardDocument'

export interface PostcardMemoryInput {
  media: { url: string }[]
}

// Renders a Collector-tier postcard export: a full-bleed front photo and a
// back panel with an optional message typed at export time (never the
// memory's own `note`) plus a copyright line that always renders.
export async function generatePostcard(
  memory: PostcardMemoryInput,
  message?: string,
): Promise<Buffer> {
  registerPdfFonts()

  const cover = memory.media[0]
  if (!cover) throw new Error('Memory has no photo to use as the postcard front')

  const image = await loadPdfImage(cover.url)
  if (!image) throw new Error('Failed to load the postcard photo')

  const copyrightYear = new Date().getFullYear()

  return renderToBuffer(
    <PostcardDocument image={image} message={message} copyrightYear={copyrightYear} />,
  )
}
