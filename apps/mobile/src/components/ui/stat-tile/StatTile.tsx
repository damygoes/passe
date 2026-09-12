import { AnimatedNumber } from '@/components/ui/animated-number'
import { useTheme } from '@/hooks/useTheme'
import { createStatTileRecipe } from '@/recipes/stat-tile'
import { Text, View } from 'react-native'

import type { StatTileProps } from './StatTile.types'

export function StatTile({
  value,
  label,
  note,
  tone = 'plain',
  size = 'md',
  delayMs = 0,
  style,
}: StatTileProps) {
  const theme = useTheme()
  const recipe = createStatTileRecipe(theme)

  return (
    <View style={[recipe.container.base, recipe.container.tones[tone], style]}>
      <AnimatedNumber
        value={value}
        delayMs={delayMs}
        style={[recipe.value.base, recipe.value.sizes[size]]}
      />
      <View style={recipe.labelRow}>
        <Text style={recipe.label}>{label}</Text>
        {note != null && <Text style={recipe.note}>{note}</Text>}
      </View>
    </View>
  )
}
