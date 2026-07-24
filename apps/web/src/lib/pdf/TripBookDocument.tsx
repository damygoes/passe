import { formatDateRange } from '@passe/utils'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from './fonts'
import type { PdfChapter } from './resolveSectionImages'
import { pdfColors } from './pdf-theme'
import { PdfChapterSection } from './sections/PdfChapterSection'

const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: pdfColors.agedCream,
  },
  coverImage: {
    width: '100%',
    height: '55%',
    objectFit: 'cover',
  },
  coverImagePlaceholder: {
    width: '100%',
    height: '55%',
    backgroundColor: pdfColors.sandyBeige,
  },
  coverTextBlock: {
    flexGrow: 1,
    paddingHorizontal: 56,
    justifyContent: 'center',
  },
  coverTitle: {
    fontFamily: pdfFontFamilies.display,
    fontWeight: 700,
    fontSize: 34,
    color: pdfColors.darkEspresso,
  },
  coverDivider: {
    marginTop: 16,
    marginBottom: 16,
    height: 1.5,
    width: 56,
    backgroundColor: pdfColors.terracotta,
  },
  coverMeta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 10,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  coverCountries: {
    fontFamily: pdfFontFamilies.heading,
    fontSize: 12,
    color: pdfColors.darkEspresso,
    marginTop: 8,
  },
  contentPage: {
    backgroundColor: pdfColors.agedCream,
    paddingHorizontal: 56,
    paddingVertical: 56,
  },
})

interface TripBookDocumentProps {
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImage: { data: Buffer; format: 'jpg' } | null
  chapters: PdfChapter[]
}

export function TripBookDocument({
  title,
  startDate,
  endDate,
  countries,
  coverImage,
  chapters,
}: TripBookDocumentProps) {
  return (
    <Document title={title} author="Passé">
      <Page size="A4" style={styles.coverPage}>
        {coverImage ? (
          <Image src={coverImage} style={styles.coverImage} />
        ) : (
          <View style={styles.coverImagePlaceholder} />
        )}
        <View style={styles.coverTextBlock}>
          <Text style={styles.coverTitle}>{title}</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverMeta}>{formatDateRange(startDate, endDate)}</Text>
          {countries.length > 0 && (
            <Text style={styles.coverCountries}>{countries.join(' - ')}</Text>
          )}
        </View>
      </Page>

      <Page size="A4" style={styles.contentPage} wrap>
        {chapters.map((chapter) => (
          <PdfChapterSection key={chapter.key} chapter={chapter} />
        ))}
      </Page>
    </Document>
  )
}
