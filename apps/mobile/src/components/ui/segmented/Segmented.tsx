import { useTheme } from '@/hooks/useTheme'
import { haptics } from '@/lib/haptics'
import { createSegmentedRecipe } from '@/recipes/segmented'
import { Text, TouchableOpacity, View } from 'react-native'

import type { SegmentedProps } from './Segmented.types'

export function Segmented({ options, value, onValueChange, style }: SegmentedProps) {
  const theme = useTheme()
  const recipe = createSegmentedRecipe(theme)

  return (
    <View style={[recipe.group, style]} accessibilityRole="radiogroup">
      {options.map((option, index) => {
        const checked = option.value === value
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            onPress={() => {
              if (checked) return
              haptics.selection()
              onValueChange(option.value)
            }}
            style={[
              recipe.item.base,
              index > 0 && recipe.item.divider,
              checked ? recipe.item.checked : recipe.item.unchecked,
            ]}
          >
            <Text
              style={[recipe.label.base, checked ? recipe.label.checked : recipe.label.unchecked]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
