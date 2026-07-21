import { Path, StyleSheet, Svg, View } from '@react-pdf/renderer'
import { pdfColors } from '../pdf-theme'
import {
  POSTCARD_STAMP_ACCENT_PATH,
  POSTCARD_STAMP_MARK_PATH,
  POSTCARD_STAMP_MARK_TRANSFORM,
  POSTCARD_STAMP_MARK_VIEWBOX,
} from './postcardStampMark'

const STAMP_WIDTH_PT = 48
const STAMP_HEIGHT_PT = 56

const styles = StyleSheet.create({
  frame: {
    width: STAMP_WIDTH_PT,
    height: STAMP_HEIGHT_PT,
    borderWidth: 1,
    borderColor: pdfColors.darkEspresso,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

// A faux airmail-style Passé stamp for the postcard's back panel — the
// brand mark standing in for a real postage stamp, not a photo.
export function PostcardStamp() {
  return (
    <View style={styles.frame}>
      <Svg viewBox={POSTCARD_STAMP_MARK_VIEWBOX} width={24} height={24}>
        <Path
          d={POSTCARD_STAMP_MARK_PATH}
          fill={pdfColors.darkEspresso}
          transform={POSTCARD_STAMP_MARK_TRANSFORM}
        />
        <Path
          d={POSTCARD_STAMP_ACCENT_PATH}
          stroke={pdfColors.terracotta}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  )
}
