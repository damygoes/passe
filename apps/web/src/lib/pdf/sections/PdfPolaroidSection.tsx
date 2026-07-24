import { formatTripDateFull, polaroidTilt } from '@passe/utils'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import { pdfColors } from '../pdf-theme'
import { PDF_NOTE_CHAR_LIMITS, truncatePdfNote } from '../pdf-text'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  frame: {
    width: '55%',
    backgroundColor: pdfColors.warmWhite,
    padding: 8,
    paddingBottom: 22,
    borderWidth: 0.5,
    borderColor: '#00000014',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    objectFit: 'cover',
  },
  note: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.darkEspresso,
    marginTop: 10,
    textAlign: 'center',
  },
  meta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    marginTop: 10,
    textAlign: 'center',
  },
  date: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 7,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 3,
    textAlign: 'center',
  },
})

interface Props {
  memory: PdfMemoryData
}

export function PdfPolaroidSection({ memory }: Props) {
  const photo = memory.images[0]
  if (!photo) return null

  const meta = pdfMemoryMetaLabel(memory)
  const rotate = polaroidTilt(memory.id) === 'left' ? '-2deg' : '2deg'

  return (
    <View style={styles.wrapper} wrap={false}>
      <View style={[styles.frame, { transform: `rotate(${rotate})` }]}>
        <Image src={photo} style={styles.image} />
        <Text style={memory.note ? styles.note : styles.meta}>
          {memory.note ? truncatePdfNote(memory.note, PDF_NOTE_CHAR_LIMITS.polaroid) : meta}
        </Text>
        <Text style={styles.date}>{formatTripDateFull(memory.capturedAt)}</Text>
      </View>
    </View>
  )
}
