import type { LayoutVariant } from '@passe/types/memory'
import { formatTripDate } from './date'

// Minimal structural shape the layout engine needs — both the web app's
// `Memory` (API) and raw Drizzle rows with joined media satisfy it.
export interface EditorialMemoryInput {
  id: string
  note?: string | null
  city?: string | null
  country?: string | null
  capturedAt: Date | string
  layoutVariant?: LayoutVariant
  sortOrder?: number | null
  media: { url: string }[]
}

// Resolved per-section presentation (never 'auto' — the engine has decided)
export type EditorialSectionVariant =
  'hero' | 'imageLeft' | 'imageRight' | 'carousel' | 'text' | 'polaroid'

// Deterministic tilt direction for polaroid frames, shared by every renderer
// (web CSS, mobile StyleSheet, PDF) so the same memory leans the same way
// everywhere, with no state to thread through.
export function polaroidTilt(id: string): 'left' | 'right' {
  return id.charCodeAt(0) % 2 === 0 ? 'left' : 'right'
}

export interface EditorialSection<M extends EditorialMemoryInput> {
  memory: M
  variant: EditorialSectionVariant
}

export interface EditorialChapter<M extends EditorialMemoryInput> {
  key: string
  // City (or country) the chapter groups by; falls back to "Oct 2025"
  title: string
  // Month/year of the chapter's first memory, omitted when it equals the title
  subtitle?: string
  sections: EditorialSection<M>[]
}

function chapterLabel(memory: EditorialMemoryInput): string {
  return memory.city ?? memory.country ?? formatTripDate(memory.capturedAt)
}

function resolveVariant(
  memory: EditorialMemoryInput,
  nextImageSide: () => 'imageLeft' | 'imageRight',
): EditorialSectionVariant {
  const photos = memory.media.length
  const override = memory.layoutVariant ?? 'auto'

  // Manual overrides, guarded against impossible combinations
  if (override === 'text') return 'text'
  if (override === 'hero') return photos >= 1 ? 'hero' : 'text'
  if (override === 'image_left') return photos >= 1 ? 'imageLeft' : 'text'
  if (override === 'image_right') return photos >= 1 ? 'imageRight' : 'text'
  if (override === 'carousel') {
    if (photos >= 2) return 'carousel'
    return photos === 1 ? 'hero' : 'text'
  }
  // Polaroid is explicit-only — the auto heuristic below never picks it
  if (override === 'polaroid') return photos >= 1 ? 'polaroid' : 'text'

  // Auto: pick from the content shape
  if (photos === 0) return 'text'
  if (memory.note) {
    if (photos >= 3) return 'carousel'
    return nextImageSide()
  }
  return photos === 1 ? 'hero' : 'carousel'
}

// Turns a trip's memories into an ordered, chaptered editorial layout.
// Order: explicit sortOrder first (nulls last), then chronological ascending —
// a travel book reads forward in time. Chapters group consecutive memories
// sharing a city (falling back to country, then month). Image/text sections
// alternate sides per chapter unless overridden.
export function buildEditorialChapters<M extends EditorialMemoryInput>(
  memories: M[],
): EditorialChapter<M>[] {
  const ordered = [...memories].sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
  })

  const chapters: EditorialChapter<M>[] = []

  for (const memory of ordered) {
    const label = chapterLabel(memory)
    let chapter = chapters[chapters.length - 1]

    if (!chapter || chapter.title !== label) {
      const monthLabel = formatTripDate(memory.capturedAt)
      chapter = {
        key: `${label}-${chapters.length}`,
        title: label,
        subtitle: label === monthLabel ? undefined : monthLabel,
        sections: [],
      }
      chapters.push(chapter)
    }

    // Alternate image side within the chapter based on how many
    // image/text sections it already contains
    const imageTextCount = chapter.sections.filter(
      (section) => section.variant === 'imageLeft' || section.variant === 'imageRight',
    ).length
    const nextImageSide = (): 'imageLeft' | 'imageRight' =>
      imageTextCount % 2 === 0 ? 'imageLeft' : 'imageRight'

    chapter.sections.push({ memory, variant: resolveVariant(memory, nextImageSide) })
  }

  return chapters
}
