import { useColorScheme } from 'react-native'
import { theme } from '@/theme'

export type { SemanticColors } from '@/theme'

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light'

  return {
    colors: colorScheme === 'dark' ? theme.colors.dark : theme.colors.light,
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
