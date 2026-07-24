import type { EditorialSectionVariant } from '@passe/utils'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import type { PdfChapter } from '../resolveSectionImages'
import { pdfColors } from '../pdf-theme'
import { PdfGridSection } from './PdfGridSection'
import { PdfHeroSection } from './PdfHeroSection'
import { PdfImageTextSection } from './PdfImageTextSection'
import { PdfPolaroidSection } from './PdfPolaroidSection'
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
    case 'polaroid':
      return <PdfPolaroidSection memory={memory} />
  }
}

interface Props {
  chapter: PdfChapter
}

export function PdfChapterSection({ chapter }: Props) {
  const [firstSection, ...restSections] = chapter.sections

  return (
    <View style={styles.chapter}>
      {/* Header + first section share one non-wrapping block so the chapter
          title can never render alone at the bottom of a page while its first
          memory gets pushed to the next one. */}
      <View wrap={false}>
        <View style={styles.header}>
          {chapter.subtitle && <Text style={styles.subtitle}>{chapter.subtitle}</Text>}
          <Text style={styles.title}>{chapter.title}</Text>
          <View style={styles.divider} />
        </View>

        {firstSection && (
          <View style={styles.section}>
            <Section memory={firstSection.memory} variant={firstSection.variant} />
          </View>
        )}
      </View>

      {restSections.map(({ memory, variant }) => (
        <View key={memory.id} style={styles.section}>
          <Section memory={memory} variant={variant} />
        </View>
      ))}
    </View>
  )
}
