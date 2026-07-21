import type { ReactNode } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { registerPdfFonts } from '../fonts'
import type { PdfMemoryData } from '../pdf-types'
import { loadPdfImage } from '../resolveSectionImages'
import { ZineDocument } from './ZineDocument'
import { ZineBackCoverPanel, ZineContentPanel, ZineFrontCoverPanel } from './ZinePanels'
import type { ZinePanelRole } from './zineTemplate'

const CONTENT_ROLES: ZinePanelRole[] = [
  'content-1',
  'content-2',
  'content-3',
  'content-4',
  'content-5',
  'content-6',
]

export interface TripZineInput {
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl: string | null
}

export interface ZineMemoryInput {
  id: string
  note?: string | null
  city?: string | null
  country?: string | null
  capturedAt: Date | string
  media: { url: string }[]
}

async function resolveZineMemory(memory: ZineMemoryInput): Promise<PdfMemoryData> {
  const cover = memory.media[0]
  const image = cover ? await loadPdfImage(cover.url) : null
  return {
    id: memory.id,
    note: memory.note,
    city: memory.city,
    country: memory.country,
    capturedAt: memory.capturedAt,
    images: image ? [image] : [],
  }
}

// Renders a trip's Collector-tier zine export: a single-sheet, fold-and-cut
// 8-panel booklet (front cover, exactly 6 selected memories in the order
// given, back cover). `memories` is always exactly 6 items
// (ZineSelectionSchema enforces this). Panel positions/rotations come
// entirely from zineTemplate.ts; this module only decides what each panel
// *role* shows.
export async function generateTripZine(
  trip: TripZineInput,
  memories: ZineMemoryInput[],
): Promise<Buffer> {
  registerPdfFonts()

  const [resolved, coverImage] = await Promise.all([
    Promise.all(memories.map(resolveZineMemory)),
    trip.coverImageUrl ? loadPdfImage(trip.coverImageUrl) : Promise.resolve(null),
  ])

  function renderPanel(role: ZinePanelRole): ReactNode {
    if (role === 'front-cover') {
      return (
        <ZineFrontCoverPanel
          title={trip.title}
          startDate={trip.startDate}
          endDate={trip.endDate}
          countries={trip.countries}
          coverImage={coverImage}
        />
      )
    }
    if (role === 'back-cover') {
      return <ZineBackCoverPanel title={trip.title} />
    }

    return <ZineContentPanel memory={resolved[CONTENT_ROLES.indexOf(role)]!} />
  }

  return renderToBuffer(<ZineDocument renderPanel={renderPanel} />)
}
