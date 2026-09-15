export const colors = {
  terracotta: {
    DEFAULT: '#C4622D',
    light: '#D4845A',
    dark: '#A34E22',
    // Full 100–900 ramp — mirrors the CSS custom properties in
    // packages/theme/styles/tokens.css (source of truth for Tailwind
    // utilities); keep the two in sync when either changes.
    100: '#FBEDE3',
    200: '#F4D9C4',
    300: '#E9B892',
    400: '#D88F5C',
    500: '#C4622D',
    600: '#A85224',
    700: '#86401B',
    800: '#5E2D13',
    900: '#3B1D0E',
  },
  sandyBeige: {
    DEFAULT: '#E8D5B0',
    light: '#F0E4C8',
    dark: '#D4BC90',
  },
  deepOlive: {
    DEFAULT: '#5C6B3A',
    light: '#7A8F50',
    dark: '#3F4A27',
    100: '#EDF0E3',
    200: '#DCE2CA',
    300: '#C3CDAA',
    400: '#98A87A',
    500: '#5C6B3A',
    600: '#4E5B31',
    700: '#3D4726',
    800: '#2B331B',
    900: '#1B2011',
  },
  agedCream: {
    DEFAULT: '#FAF6EE',
  },
  warmWhite: {
    DEFAULT: '#FFFDF8',
  },
  darkEspresso: {
    DEFAULT: '#2C1A0E',
    // A richer, slightly redder-black step used only as a solid card
    // background (the Upgrade screen's Collector tier, Home's import
    // prompt) — never for text, where DEFAULT is correct.
    dark: '#3B1D0E',
  },
  mutedTaupe: {
    DEFAULT: '#8C7B6B',
    light: '#A89888',
    dark: '#6E5F51',
  },
} as const

export type ColorToken = typeof colors
