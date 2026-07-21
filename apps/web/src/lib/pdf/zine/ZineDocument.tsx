import type { ReactNode } from 'react'
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'
import { pdfColors } from '../pdf-theme'
import { type ZinePanelRole, zinePanels } from './zineTemplate'

// react-pdf's A4 landscape resolution (@react-pdf/layout PAGE_SIZES.A4, flipped for
// landscape). Rows/panels are sized off these directly, rather than flexGrow against
// the Page's own height, because react-pdf's Yoga height for a Page node only ever
// comes from its box (not its style) — and that box is only patched to the true page
// size by its normal pagination pass. A flexGrow row therefore isn't guaranteed to fill
// the physical page; a hard pt value always sums to exactly the full sheet regardless.
const PAGE_WIDTH_PT = 841.89
const PAGE_HEIGHT_PT = 595.28
const ROW_HEIGHT_PT = PAGE_HEIGHT_PT / 2
const PANEL_WIDTH_PT = PAGE_WIDTH_PT / 4

// Every internal row/column boundary is a physical fold (or fold+cut) line once the
// sheet is folded into the booklet — none of them are trimmed page edges. Folding by
// eye against a blank edge is exactly what caused panels to read as off-center and
// content to get pinched in the crease, so we print short tick marks at each boundary,
// at both ends, as a fold guide.
const FOLD_TICK_LENGTH_PT = 8
const COLUMN_FOLD_X_PT = [PANEL_WIDTH_PT, PANEL_WIDTH_PT * 2, PANEL_WIDTH_PT * 3]
const ROW_FOLD_Y_PT = ROW_HEIGHT_PT

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    height: ROW_HEIGHT_PT,
  },
  panel: {
    width: PANEL_WIDTH_PT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  foldGuides: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PAGE_WIDTH_PT,
    height: PAGE_HEIGHT_PT,
  },
  columnFoldTick: {
    position: 'absolute',
    width: 0.75,
    height: FOLD_TICK_LENGTH_PT,
    backgroundColor: pdfColors.mutedTaupe,
  },
  rowFoldTick: {
    position: 'absolute',
    width: FOLD_TICK_LENGTH_PT,
    height: 0.75,
    backgroundColor: pdfColors.mutedTaupe,
  },
})

const ROWS: ZinePanelRole[][] = [0, 1].map((row) =>
  zinePanels
    .filter((panel) => panel.position.row === row)
    .sort((a, b) => a.position.col - b.position.col)
    .map((panel) => panel.role),
)

interface ZineDocumentProps {
  renderPanel: (role: ZinePanelRole) => ReactNode
}

// Lays out the 8 zine panels per zineTemplate.ts's position/rotation map.
// Content-agnostic on purpose — the caller decides what each panel role
// renders (real trip content, or plain numbers for the physical fold
// verification test in scripts/generate-zine-fold-test.tsx).
export function ZineDocument({ renderPanel }: ZineDocumentProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {ROWS.map((rowRoles, row) => (
          <View key={row} style={styles.row}>
            {rowRoles.map((role) => {
              const panel = zinePanels.find((candidate) => candidate.role === role)
              const rotation = panel?.position.rotation ?? 0
              const panelStyle = rotation
                ? { ...styles.panel, transform: `rotate(${rotation}deg)` }
                : styles.panel
              return (
                <View key={role} style={panelStyle}>
                  {renderPanel(role)}
                </View>
              )
            })}
          </View>
        ))}
        <View style={styles.foldGuides}>
          {COLUMN_FOLD_X_PT.map((x) => (
            <View
              key={`col-top-${x}`}
              style={[styles.columnFoldTick, { left: x - 0.375, top: 0 }]}
            />
          ))}
          {COLUMN_FOLD_X_PT.map((x) => (
            <View
              key={`col-bottom-${x}`}
              style={[
                styles.columnFoldTick,
                { left: x - 0.375, top: PAGE_HEIGHT_PT - FOLD_TICK_LENGTH_PT },
              ]}
            />
          ))}
          <View style={[styles.rowFoldTick, { left: 0, top: ROW_FOLD_Y_PT - 0.375 }]} />
          <View
            style={[
              styles.rowFoldTick,
              { left: PAGE_WIDTH_PT - FOLD_TICK_LENGTH_PT, top: ROW_FOLD_Y_PT - 0.375 },
            ]}
          />
        </View>
      </Page>
    </Document>
  )
}
