import { useTheme } from '@/hooks/useTheme'
import { haptics } from '@/lib/haptics'
import { createSwitchRecipe } from '@/recipes/switch'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import type { SwitchProps } from './Switch.types'

// 150ms ease, per the redesign's interaction spec — the only animated
// control besides hover/press tints.
const TOGGLE_DURATION_MS = 150

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  style,
  accessibilityLabel,
}: SwitchProps) {
  const theme = useTheme()
  const recipe = createSwitchRecipe(theme)
  const progress = useSharedValue(checked ? 1 : 0)

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: TOGGLE_DURATION_MS,
      reduceMotion: ReduceMotion.System,
    })
  }, [checked, progress])

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          recipe.thumbInset +
          progress.value * (recipe.width - recipe.thumbSize - recipe.thumbInset * 2),
      },
    ],
  }))

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        haptics.selection()
        onCheckedChange(!checked)
      }}
      style={[
        recipe.track.base,
        checked ? recipe.track.checked : recipe.track.unchecked,
        disabled && recipe.track.disabled,
        style,
      ]}
    >
      <Animated.View style={[recipe.thumb, thumbStyle]} />
    </TouchableOpacity>
  )
}
