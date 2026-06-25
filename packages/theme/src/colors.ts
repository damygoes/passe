export const colors = {
  terracotta: {
    DEFAULT: '#C4622D',
    light: '#D4845A',
    dark: '#A34E22',
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
  },
  agedCream: {
    DEFAULT: '#FAF6EE',
  },
  warmWhite: {
    DEFAULT: '#FFFDF8',
  },
  darkEspresso: {
    DEFAULT: '#2C1A0E',
  },
  mutedTaupe: {
    DEFAULT: '#8C7B6B',
    light: '#A89888',
    dark: '#6E5F51',
  },
} as const

export type ColorToken = typeof colors
