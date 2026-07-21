// Static counterpart of the web's CarouselSection (apps/web/src/features/trips/components/editorial/CarouselSection.tsx) —
// a PDF page can't scroll, so the horizontal-scroll gallery becomes a 2-column grid instead.
import { formatTripDateFull } from '@passe/utils'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'
import { captionStyles } from './pdf-section-styles'

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '48.5%',
  },
  image: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 4,
  },
})

interface Props {
  memory: PdfMemoryData
}

export function PdfGridSection({ memory }: Props) {
  if (memory.images.length === 0) return null

  const meta = pdfMemoryMetaLabel(memory)

  return (
    <View wrap={false}>
      <View style={styles.grid}>
        {memory.images.map((image, index) => (
          <View key={index} style={styles.cell}>
            <Image src={image} style={styles.image} />
          </View>
        ))}
      </View>
      <View style={captionStyles.row}>
        <Text style={memory.note ? captionStyles.note : captionStyles.meta}>
          {memory.note || meta}
        </Text>
        <Text style={captionStyles.date}>{formatTripDateFull(memory.capturedAt)}</Text>
      </View>
    </View>
  )
}
