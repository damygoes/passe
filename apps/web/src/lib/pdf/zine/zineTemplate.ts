// Position/rotation table for the classic single-sheet, one-cut, 8-panel
// zine fold. A first guess at this table (checkerboard-alternating
// rotation) was printed and physically folded and confirmed WRONG. This
// version comes from an actual diagram — Jared Manninen's step-numbered
// zine tutorial (tahoetrailguide.com, "8-Page Zine Page Layout" +
// "Instructions" images) — cross-checked against a reference video's fold
// sequence (fold, fold, cut, fold, fold). Whole rows rotate together, not
// per-cell. Still: re-run the print-and-fold test after any change here
// before trusting it — a single wrong panel/rotation makes the physical
// booklet unreadable, which no amount of type-checking or unit testing
// can catch. Fix only the two arrays below if it's ever wrong again.
export type ZinePanelRole =
  | 'front-cover'
  | 'back-cover'
  | 'content-1'
  | 'content-2'
  | 'content-3'
  | 'content-4'
  | 'content-5'
  | 'content-6'

export interface ZinePanelPosition {
  row: 0 | 1
  col: 0 | 1 | 2 | 3
  /** Degrees to rotate this panel's content so it reads upright once folded. */
  rotation: 0 | 180
}

export interface ZinePanel {
  role: ZinePanelRole
  position: ZinePanelPosition
}

// Page number -> role. 1 = front cover, 2-7 = the six content panels in
// reading order, 8 = back cover.
const PAGE_TO_ROLE: Record<number, ZinePanelRole> = {
  1: 'front-cover',
  2: 'content-1',
  3: 'content-2',
  4: 'content-3',
  5: 'content-4',
  6: 'content-5',
  7: 'content-6',
  8: 'back-cover',
}

// Grid position (row, col) -> page number, on the flat unfolded sheet.
const GRID_PAGE_NUMBERS: readonly (readonly number[])[] = [
  [5, 4, 3, 2],
  [6, 7, 8, 1],
]

// Grid position (row, col) -> rotation needed so the panel reads upright
// once the sheet is folded into a booklet. Whole rows rotate together.
const GRID_ROTATIONS: readonly (readonly (0 | 180)[])[] = [
  [180, 180, 180, 180],
  [0, 0, 0, 0],
]

export const zinePanels: ZinePanel[] = GRID_PAGE_NUMBERS.flatMap((rowPages, row) =>
  rowPages.map((page, col) => ({
    role: PAGE_TO_ROLE[page]!,
    position: {
      row: row as 0 | 1,
      col: col as 0 | 1 | 2 | 3,
      rotation: GRID_ROTATIONS[row]![col]!,
    },
  })),
)

export function panelForRole(role: ZinePanelRole): ZinePanel {
  const panel = zinePanels.find((p) => p.role === role)
  if (!panel) throw new Error(`No zine panel registered for role: ${role}`)
  return panel
}
