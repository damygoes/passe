import { formatTripDateFull } from '@passe/utils'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'
import { pdfColors } from '../pdf-theme'
import { PDF_NOTE_CHAR_LIMITS, truncatePdfNote } from '../pdf-text'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  note: {
    fontFamily: pdfFontFamilies.heading,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 1.6,
    color: pdfColors.darkEspresso,
    textAlign: 'center',
    maxWidth: 340,
  },
  meta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
  },
})

interface Props {
  memory: PdfMemoryData
}

export function PdfTextSection({ memory }: Props) {
  const meta = pdfMemoryMetaLabel(memory)
  // See PdfImageTextSection.tsx — '·' crashes the DM Mono PDF font subset.
  const metaLine = [meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join('  -  ')

  return (
    <View wrap={false} style={styles.container}>
      {memory.note && (
        <Text style={styles.note}>{truncatePdfNote(memory.note, PDF_NOTE_CHAR_LIMITS.text)}</Text>
      )}
      <Text style={styles.meta}>{metaLine}</Text>
    </View>
  )
}
