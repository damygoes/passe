import { colors as palette } from '@passe/theme'
import { darkColors, lightColors } from './colors'
import { borderRadius, spacing } from './spacing'
import { fonts, fontSizes, fontWeights, lineHeights } from './typography'

export { darkColors, lightColors, type SemanticColors } from './colors'
export { borderRadius, spacing } from './spacing'
export { fonts, fontSizes, fontWeights, lineHeights, resolveLineHeight } from './typography'

export const theme = {
  colors: { light: lightColors, dark: darkColors, palette },
  spacing,
  borderRadius,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
} as const

export type ThemeDefinition = typeof theme
