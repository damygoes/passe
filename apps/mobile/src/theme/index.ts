export { lightColors, darkColors, type SemanticColors } from './colors'
export { spacing, borderRadius } from './spacing'
export { fonts, fontSizes, fontWeights, lineHeights, resolveLineHeight } from './typography'

import { colors as palette } from '@passe/theme'
import { lightColors, darkColors } from './colors'
import { spacing, borderRadius } from './spacing'
import { fonts, fontSizes, fontWeights, lineHeights } from './typography'

export const theme = {
  colors: { light: lightColors, dark: darkColors, palette },
  spacing,
  borderRadius,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
} as const

export type Theme = typeof theme
