import type { EditorialSectionVariant } from '@passe/utils'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import type { PdfChapter } from '../resolveSectionImages'
import { pdfColors } from '../pdf-theme'
import { PdfGridSection } from './PdfGridSection'
import { PdfHeroSection } from './PdfHeroSection'
import { PdfImageTextSection } from './PdfImageTextSection'
import { PdfTextSection } from './PdfTextSection'
import type { PdfMemoryData } from '../pdf-types'

const styles = StyleSheet.create({
  chapter: {
    marginBottom: 28,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontFamily: pdfFontFamilies.heading,
    fontWeight: 600,
    fontSize: 20,
    color: pdfColors.darkEspresso,
  },
  divider: {
    marginTop: 8,
    height: 1.5,
    width: 40,
    backgroundColor: pdfColors.terracotta,
  },
  section: {
    marginBottom: 20,
  },
})

function Section({ memory, variant }: { memory: PdfMemoryData; variant: EditorialSectionVariant }) {
  switch (variant) {
    case 'hero':
      return <PdfHeroSection memory={memory} />
    case 'imageLeft':
      return <PdfImageTextSection memory={memory} side="left" />
    case 'imageRight':
      return <PdfImageTextSection memory={memory} side="right" />
    case 'carousel':
      return <PdfGridSection memory={memory} />
    case 'text':
      return <PdfTextSection memory={memory} />
  }
}

interface Props {
  chapter: PdfChapter
}

export function PdfChapterSection({ chapter }: Props) {
  return (
    <View style={styles.chapter}>
      <View style={styles.header}>
        {chapter.subtitle && <Text style={styles.subtitle}>{chapter.subtitle}</Text>}
        <Text style={styles.title}>{chapter.title}</Text>
        <View style={styles.divider} />
      </View>

      {chapter.sections.map(({ memory, variant }) => (
        <View key={memory.id} style={styles.section}>
          <Section memory={memory} variant={variant} />
        </View>
      ))}
    </View>
  )
}
