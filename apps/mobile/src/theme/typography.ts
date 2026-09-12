import { Platform } from 'react-native'
import { fontFamilies } from '@passe/theme'

export { fontSizes, fontWeights, lineHeights } from '@passe/theme'

// fontFamilies entries are string[] arrays. React Native's fontFamily takes a
// single string, so we pick the right entry per platform. Web gets the full
// CSS font-stack. iOS/Android use the brand typefaces embedded at build time
// via the expo-font config plugin (app.json) from assets/fonts/ — the family
// names below must match the TTFs' internal family names, and any new weight
// needs its face added to both the assets folder and the plugin config.
export const fonts = {
  display: Platform.select({
    ios: fontFamilies.display[0], // 'Playfair Display'
    android: fontFamilies.display[0],
    web: fontFamilies.display.join(', '), // 'Playfair Display, Georgia, serif'
    default: 'serif',
  }) as string,

  body: Platform.select({
    ios: fontFamilies.body[0], // 'Helvetica Neue'
    android: 'sans-serif',
    web: fontFamilies.body.join(', '), // 'Helvetica Neue, Helvetica, Arial, sans-serif'
    default: 'sans-serif',
  }) as string,

  mono: Platform.select({
    ios: fontFamilies.mono[0], // 'DM Mono'
    android: fontFamilies.mono[0],
    web: fontFamilies.mono.join(', '), // 'DM Mono, Menlo, monospace'
    default: 'monospace',
  }) as string,
}

// lineHeights from @passe/theme are unitless multipliers (e.g. 1.5).
// React Native's lineHeight requires absolute pixels — use this helper.
export function resolveLineHeight(fontSize: number, multiplier: number): number {
  return Math.round(fontSize * multiplier)
}
