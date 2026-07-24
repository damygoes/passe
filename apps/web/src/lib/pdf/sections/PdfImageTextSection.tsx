import { formatTripDateFull } from '@passe/utils'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'
import { pdfColors } from '../pdf-theme'
import { PDF_NOTE_CHAR_LIMITS, truncatePdfNote } from '../pdf-text'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  imageColumn: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 170,
    objectFit: 'cover',
    borderRadius: 4,
  },
  textColumn: {
    flex: 1,
  },
  meta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  note: {
    fontFamily: pdfFontFamilies.heading,
    fontSize: 13,
    lineHeight: 1.5,
    color: pdfColors.darkEspresso,
  },
})

interface Props {
  memory: PdfMemoryData
  side: 'left' | 'right'
}

export function PdfImageTextSection({ memory, side }: Props) {
  const cover = memory.images[0]
  if (!cover) return null

  const meta = pdfMemoryMetaLabel(memory)
  // Not '·' (U+00B7) — the vendored DM Mono woff2 crashes fontkit's PDF
  // subsetter on that glyph specifically (verified against the real font
  // files; a plain hyphen renders fine in every registered PDF font).
  const metaLine = [meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join('  -  ')

  const imageBlock = (
    <View style={styles.imageColumn}>
      <Image src={cover} style={styles.image} />
    </View>
  )
  const textBlock = (
    <View style={styles.textColumn}>
      <Text style={styles.meta}>{metaLine}</Text>
      {memory.note && (
        <Text style={styles.note}>
          {truncatePdfNote(memory.note, PDF_NOTE_CHAR_LIMITS.imageText)}
        </Text>
      )}
    </View>
  )

  return (
    <View wrap={false} style={styles.row}>
      {side === 'left' ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </View>
  )
}
