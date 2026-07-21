import { formatTripDateFull } from '@passe/utils'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'
import { captionStyles } from './pdf-section-styles'

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
    borderRadius: 4,
  },
})

interface Props {
  memory: PdfMemoryData
}

export function PdfHeroSection({ memory }: Props) {
  const cover = memory.images[0]
  if (!cover) return null

  const meta = pdfMemoryMetaLabel(memory)

  return (
    <View wrap={false}>
      <Image src={cover} style={styles.image} />
      <View style={captionStyles.row}>
        <Text style={memory.note ? captionStyles.note : captionStyles.meta}>
          {memory.note || meta}
        </Text>
        <Text style={captionStyles.date}>{formatTripDateFull(memory.capturedAt)}</Text>
      </View>
    </View>
  )
}
