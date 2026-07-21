import type { EditorialChapter, EditorialMemoryInput } from '@passe/utils'
import { renderToBuffer } from '@react-pdf/renderer'
import { TripBookDocument } from './TripBookDocument'
import { registerPdfFonts } from './fonts'
import { loadPdfImage, resolveSectionImages } from './resolveSectionImages'

export interface TripPdfInput {
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl: string | null
}

// Renders a trip's editorial chapters (already resolved by buildEditorialChapters
// from @passe/utils — the same layout engine that powers the web trip page) into
// a downloadable PDF keepsake. Fonts and images are embedded as real bytes,
// since @react-pdf/renderer runs with no browser and no access to the app's
// signed-URL delivery pipeline.
export async function generateTripPdf(
  trip: TripPdfInput,
  chapters: EditorialChapter<EditorialMemoryInput>[],
): Promise<Buffer> {
  registerPdfFonts()

  const [coverImage, pdfChapters] = await Promise.all([
    trip.coverImageUrl ? loadPdfImage(trip.coverImageUrl) : Promise.resolve(null),
    resolveSectionImages(chapters),
  ])

  return renderToBuffer(
    <TripBookDocument
      title={trip.title}
      startDate={trip.startDate}
      endDate={trip.endDate}
      countries={trip.countries}
      coverImage={coverImage}
      chapters={pdfChapters}
    />,
  )
}
