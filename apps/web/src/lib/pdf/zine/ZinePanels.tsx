import { formatDateRange, formatTripDateFull } from '@passe/utils'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import { pdfColors } from '../pdf-theme'
import type { PdfMemoryData } from '../pdf-types'
import { pdfMemoryMetaLabel } from '../pdf-types'

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  imagePanel: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  coverTitle: {
    fontFamily: pdfFontFamilies.display,
    fontWeight: 700,
    fontSize: 19,
    color: pdfColors.darkEspresso,
    textAlign: 'center',
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    height: 1.5,
    width: 32,
    backgroundColor: pdfColors.terracotta,
  },
  coverMeta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  coverCountries: {
    fontFamily: pdfFontFamilies.heading,
    fontSize: 9,
    color: pdfColors.darkEspresso,
    marginTop: 6,
    textAlign: 'center',
  },
  backCoverTitle: {
    fontFamily: pdfFontFamilies.display,
    fontWeight: 700,
    fontSize: 13,
    color: pdfColors.darkEspresso,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: pdfFontFamilies.heading,
    fontStyle: 'italic',
    fontSize: 9,
    color: pdfColors.mutedTaupe,
    marginTop: 8,
    textAlign: 'center',
  },
  contentImage: {
    width: '100%',
    height: '70%',
    objectFit: 'cover',
    borderRadius: 3,
  },
  contentCaptionWrap: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  contentNote: {
    fontFamily: pdfFontFamilies.heading,
    fontStyle: 'italic',
    fontSize: 9,
    color: pdfColors.darkEspresso,
    textAlign: 'center',
  },
  contentMeta: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 7,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
})

interface CoverPanelProps {
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
}

export function ZineFrontCoverPanel({ title, startDate, endDate, countries }: CoverPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.coverTitle}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.coverMeta}>{formatDateRange(startDate, endDate)}</Text>
      {countries.length > 0 && <Text style={styles.coverCountries}>{countries.join(' - ')}</Text>}
    </View>
  )
}

export function ZineBackCoverPanel({ title }: { title: string }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.backCoverTitle}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.tagline}>The past, beautifully kept.</Text>
    </View>
  )
}

interface PlaceholderPanelProps {
  startDate: Date | string
  endDate: Date | string
}

// Used for any of the 6 content panels left unselected (the picker allows
// 1-6, not exactly 6) — keeps the zine feeling designed rather than blank.
export function ZinePlaceholderPanel({ startDate, endDate }: PlaceholderPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.divider} />
      <Text style={styles.coverMeta}>{formatDateRange(startDate, endDate)}</Text>
    </View>
  )
}

interface ContentPanelProps {
  memory: PdfMemoryData
}

export function ZineContentPanel({ memory }: ContentPanelProps) {
  const cover = memory.images[0]
  const meta = pdfMemoryMetaLabel(memory)
  const metaLine = [meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join('  -  ')

  if (!cover) {
    return (
      <View style={styles.panel}>
        {memory.note && <Text style={styles.contentNote}>{memory.note}</Text>}
        {metaLine && <Text style={styles.contentMeta}>{metaLine}</Text>}
      </View>
    )
  }

  return (
    <View style={styles.imagePanel}>
      <Image src={cover} style={styles.contentImage} />
      <View style={styles.contentCaptionWrap}>
        {memory.note && <Text style={styles.contentNote}>{memory.note}</Text>}
        {metaLine && <Text style={styles.contentMeta}>{metaLine}</Text>}
      </View>
    </View>
  )
}
