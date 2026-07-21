import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfFontFamilies } from '../fonts'
import { pdfColors } from '../pdf-theme'
import { PostcardStamp } from './PostcardStamp'
import { PostcardWordmark } from './PostcardWordmark'

// A6 postcard, landscape, in points (1mm = 2.83465pt).
export const POSTCARD_PAGE_WIDTH_PT = 419.53 // 148mm
export const POSTCARD_PAGE_HEIGHT_PT = 297.64 // 105mm

const COPYRIGHT_HEIGHT_PT = 28
const CONTENT_HEIGHT_PT = POSTCARD_PAGE_HEIGHT_PT - COPYRIGHT_HEIGHT_PT
const MESSAGE_WIDTH_PT = 260
const DIVIDER_WIDTH_PT = 1
const ADDRESS_LINE_COUNT = 4

const styles = StyleSheet.create({
  page: {
    width: POSTCARD_PAGE_WIDTH_PT,
    height: POSTCARD_PAGE_HEIGHT_PT,
    backgroundColor: pdfColors.agedCream,
  },
  content: {
    flexDirection: 'row',
    height: CONTENT_HEIGHT_PT,
    width: '100%',
  },
  messageColumn: {
    width: MESSAGE_WIDTH_PT,
    padding: 20,
    justifyContent: 'flex-start',
  },
  message: {
    fontFamily: pdfFontFamilies.heading,
    fontStyle: 'italic',
    fontSize: 11,
    lineHeight: 1.5,
    color: pdfColors.darkEspresso,
  },
  divider: {
    width: DIVIDER_WIDTH_PT,
    marginVertical: 16,
    backgroundColor: pdfColors.mutedTaupe,
  },
  addressColumn: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  addressLines: {
    width: '100%',
    alignItems: 'flex-end',
  },
  addressLine: {
    width: '90%',
    height: 1,
    marginTop: 18,
    backgroundColor: pdfColors.mutedTaupe,
  },
  copyrightStrip: {
    height: COPYRIGHT_HEIGHT_PT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopWidth: 0.5,
    borderTopColor: pdfColors.mutedTaupe,
  },
  copyrightText: {
    fontFamily: pdfFontFamilies.mono,
    fontSize: 7,
    color: pdfColors.mutedTaupe,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

interface PostcardBackPanelProps {
  message?: string
  copyrightYear: number
}

// The back of the postcard: a written message on the left, a blank
// address area with a faux Passé stamp on the right, and a copyright line
// (year + the real brand wordmark, not plain text) that always renders
// across the bottom regardless of whether a message was written.
export function PostcardBackPanel({ message, copyrightYear }: PostcardBackPanelProps) {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.messageColumn}>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
        <View style={styles.divider} />
        <View style={styles.addressColumn}>
          <PostcardStamp />
          <View style={styles.addressLines}>
            {Array.from({ length: ADDRESS_LINE_COUNT }).map((_, index) => (
              <View key={index} style={styles.addressLine} />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.copyrightStrip}>
        <Text style={styles.copyrightText}>© {copyrightYear}</Text>
        <PostcardWordmark />
      </View>
    </View>
  )
}
