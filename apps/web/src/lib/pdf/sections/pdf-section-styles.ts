import { StyleSheet } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import { pdfColors } from '../pdf-theme'

// Shared across section components — kept in one place so the caption/meta
// row (note vs. city/country fallback, date in mono) reads consistently
// regardless of which layout variant is showing it, mirroring the web
// editorial components' shared visual language.
export const captionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
    gap: 12,
  },
  note: {
    fontFamily: pdfFontFamilies.heading,
    fontSize: 11,
    color: pdfColors.darkEspresso,
    flexGrow: 1,
    flexShrink: 1,
  },
  meta: {
    fontFamily: pdfFontFamilies.heading,
    fontSize: 10,
    color: pdfColors.mutedTaupe,
    flexGrow: 1,
    flexShrink: 1,
  },
  date: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 8,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})
