// @react-pdf/renderer's `wrap={false}` only keeps a block atomic (never split
// across a page boundary) if the block's rendered height fits within one full,
// empty page — if it doesn't, the layout engine silently overrides `wrap={false}`
// and lets the block overflow the page anyway. None of the note/caption text
// styles bound their height, so an unusually long memory note can defeat
// `wrap={false}` and split a memory's photo+caption across two pages. These caps
// are deliberately conservative (well under the point where a block would
// actually exceed a page) — the goal is guaranteeing atomicity, not maximizing
// text length.
export const PDF_NOTE_CHAR_LIMITS = {
  imageText: 360,
  hero: 600,
  grid: 600,
  text: 400,
  polaroid: 140,
} as const

export function truncatePdfNote(note: string, maxChars: number): string {
  if (note.length <= maxChars) return note
  return `${note.slice(0, maxChars).trimEnd()}…`
}
