import { Path, Svg } from '@react-pdf/renderer'
import { pdfColors } from '../pdf-theme'
import {
  POSTCARD_WORDMARK_ACCENT_PATH,
  POSTCARD_WORDMARK_GROUP_TRANSFORM,
  POSTCARD_WORDMARK_LETTERS_PATH,
  POSTCARD_WORDMARK_PERIOD_PATH,
  POSTCARD_WORDMARK_VIEWBOX,
} from '../postcard/postcardWordmarkPaths'

const WORDMARK_WIDTH_PT = 22
const WORDMARK_ASPECT_RATIO = 285 / 86
const WORDMARK_HEIGHT_PT = WORDMARK_WIDTH_PT / WORDMARK_ASPECT_RATIO

// The Passé wordmark for the zine back cover's copyright line — same path
// data as PostcardWordmark.tsx, sized down for the much narrower zine panel.
export function ZineWordmark() {
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
      <Path
        d={POSTCARD_WORDMARK_ACCENT_PATH}
        stroke={pdfColors.terracotta}
        strokeWidth={8.55}
        strokeLinecap="round"
        fill="none"
        transform={POSTCARD_WORDMARK_GROUP_TRANSFORM}
      />
    </Svg>
  )
}
