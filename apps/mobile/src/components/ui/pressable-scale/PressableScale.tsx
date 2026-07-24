import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { haptics } from '@/lib/haptics'
import { pressSpring } from '@/lib/motion'
import type { PressableScaleProps } from './PressableScale.types'

/**
 * Pressable with springy scale-down feedback. When `restRotation` is set the
 * content also sits at a slight tilt and straightens while pressed.
 */
export function PressableScale({
  pressedScale = 0.97,
  restRotation = 0,
  haptic = true,
  containerStyle,
  onPressIn,
  onPressOut,
  children,
  ...props
}: PressableScaleProps) {
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - pressed.value * (1 - pressedScale) },
      { rotate: `${restRotation * (1 - pressed.value)}deg` },
    ],
  }))

  return (
    <Animated.View style={[animatedStyle, containerStyle]}>
      <Pressable
        onPressIn={(event) => {
          pressed.value = withSpring(1, pressSpring)
          if (haptic) haptics.impactLight()
          onPressIn?.(event)
        }}
        onPressOut={(event) => {
          pressed.value = withSpring(0, pressSpring)
          onPressOut?.(event)
        }}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  )
}
