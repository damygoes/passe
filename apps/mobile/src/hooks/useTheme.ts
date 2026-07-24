import { theme } from '@/theme'
import { useIsScrapbookTheme } from '@/theme/ScrapbookThemeContext'
import { useColorScheme } from 'react-native'

export type { SemanticColors } from '@/theme'

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light'
  const isScrapbook = useIsScrapbookTheme()

  const colors = isScrapbook
    ? colorScheme === 'dark'
      ? theme.colors.scrapbookDark
      : theme.colors.scrapbookLight
    : colorScheme === 'dark'
      ? theme.colors.dark
      : theme.colors.light

  return {
    colors,
    isScrapbook,
    palette: theme.colors.palette,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    fonts: theme.fonts,
    fontSizes: theme.fontSizes,
    fontWeights: theme.fontWeights,
    lineHeights: theme.lineHeights,
    colorScheme,
  }
}

export type AppTheme = ReturnType<typeof useTheme>
