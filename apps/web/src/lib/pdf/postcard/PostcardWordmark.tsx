import { Path, Svg } from '@react-pdf/renderer'
import { pdfColors } from '../pdf-theme'
import {
  POSTCARD_WORDMARK_GROUP_TRANSFORM,
  POSTCARD_WORDMARK_LETTERS_PATH,
  POSTCARD_WORDMARK_PERIOD_PATH,
  POSTCARD_WORDMARK_VIEWBOX,
} from './postcardWordmarkPaths'

const WORDMARK_WIDTH_PT = 34
const WORDMARK_ASPECT_RATIO = 285 / 86
const WORDMARK_HEIGHT_PT = WORDMARK_WIDTH_PT / WORDMARK_ASPECT_RATIO

// The Passe wordmark for the postcard's copyright line — see
// PostcardStamp.tsx for the bare-mark version used as the faux stamp.
export function PostcardWordmark() {
  return (
    <Svg viewBox={POSTCARD_WORDMARK_VIEWBOX} width={WORDMARK_WIDTH_PT} height={WORDMARK_HEIGHT_PT}>
      <Path
        d={POSTCARD_WORDMARK_LETTERS_PATH}
        fill={pdfColors.darkEspresso}
        transform={POSTCARD_WORDMARK_GROUP_TRANSFORM}
      />
      <Path
        d={POSTCARD_WORDMARK_PERIOD_PATH}
        fill={pdfColors.terracotta}
        transform={POSTCARD_WORDMARK_GROUP_TRANSFORM}
      />
    </Svg>
  )
}
