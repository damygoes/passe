import { useTheme } from '@/hooks/useTheme'
import { View } from 'react-native'
import type { SeparatorProps } from './Separator.types'

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  const { colors } = useTheme()

  const base =
    orientation === 'horizontal'
      ? { height: 1, width: '100%' as const }
      : { width: 1, alignSelf: 'stretch' as const }

  return <View style={[base, { backgroundColor: colors.border }, style]} />
}
