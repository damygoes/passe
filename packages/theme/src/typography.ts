export const fontFamilies = {
  display: ['Playfair Display', 'Georgia', 'serif'],
  heading: ['Lora', 'Georgia', 'serif'],
  body: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  mono: ['DM Mono', 'Menlo', 'monospace'],
} as const

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const lineHeights = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

export type FontFamilyToken = typeof fontFamilies
export type FontSizeToken = typeof fontSizes
