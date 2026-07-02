import { Platform } from 'react-native'
import { fontFamilies } from '@passe/theme'

export { fontSizes, fontWeights, lineHeights } from '@passe/theme'

// fontFamilies entries are string[] arrays. React Native's fontFamily takes a
// single string, so we pick the right entry per platform. Web gets the full
// CSS font-stack. iOS/Android fall back to system fonts until expo-font loads
// the custom typefaces — swap the ios values for PostScript names at that point.
export const fonts = {
  display: Platform.select({
    ios: fontFamilies.display[1],         // 'Georgia'
    android: 'serif',
    web: fontFamilies.display.join(', '), // 'Playfair Display, Georgia, serif'
    default: 'serif',
  }) as string,

  heading: Platform.select({
    ios: fontFamilies.heading[1],         // 'Georgia'
    android: 'serif',
    web: fontFamilies.heading.join(', '), // 'Lora, Georgia, serif'
    default: 'serif',
  }) as string,

  body: Platform.select({
    ios: fontFamilies.body[0],            // 'Helvetica Neue'
    android: 'sans-serif',
    web: fontFamilies.body.join(', '),    // 'Helvetica Neue, Helvetica, Arial, sans-serif'
    default: 'sans-serif',
  }) as string,

  mono: Platform.select({
    ios: fontFamilies.mono[1],            // 'Menlo'
    android: 'monospace',
    web: fontFamilies.mono.join(', '),    // 'DM Mono, Menlo, monospace'
    default: 'monospace',
  }) as string,
}

// lineHeights from @passe/theme are unitless multipliers (e.g. 1.5).
// React Native's lineHeight requires absolute pixels — use this helper.
export function resolveLineHeight(fontSize: number, multiplier: number): number {
  return Math.round(fontSize * multiplier)
}
