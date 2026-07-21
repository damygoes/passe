import type { ReactNode } from 'react'
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'
import { type ZinePanelRole, zinePanels } from './zineTemplate'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  panel: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
      </Page>
    </Document>
  )
}
