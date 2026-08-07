import { GlassSurface } from '@/components/ui/glass-surface'
import { Spinner } from '@/components/ui/spinner'
import { useTheme } from '@/hooks/useTheme'
import { haptics } from '@/lib/haptics'
import { pressSpring } from '@/lib/motion'
import { createButtonRecipe } from '@/recipes/button'

import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import type { ButtonProps } from './Button.types'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const theme = useTheme()
  const recipe = createButtonRecipe(theme)
  const pressed = useSharedValue(0)

  const isDisabled = disabled || loading

  const variantRecipe = recipe.variants[variant]
  const sizeRecipe = recipe.sizes[size]

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }))

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      disabled={isDisabled}
      onPressIn={(event) => {
        pressed.value = withSpring(1, pressSpring)
        haptics.selection()
        onPressIn?.(event)
      }}
      onPressOut={(event) => {
        pressed.value = withSpring(0, pressSpring)
        onPressOut?.(event)
      }}
      style={[
        recipe.base.container,
        variantRecipe.container,
        sizeRecipe.container,
        fullWidth && recipe.states.fullWidth.container,
        isDisabled && recipe.states.disabled.container,
        pressStyle,
        style,
      ]}
      {...props}
    >
      {variant === 'ghost' && <GlassSurface shape="capsule" style={StyleSheet.absoluteFill} />}
      {loading ? (
        <Spinner color={variantRecipe.spinnerColor} />
      ) : typeof children === 'string' ? (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          style={[recipe.base.label, variantRecipe.label, sizeRecipe.label]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedTouchable>
  )
}
