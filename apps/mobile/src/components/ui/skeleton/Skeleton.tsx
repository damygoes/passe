import { useTheme } from '@/hooks/useTheme'
import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import type { SkeletonProps } from './Skeleton.types'

export function Skeleton({ style, ...props }: SkeletonProps) {
  const { colors, borderRadius } = useTheme()
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800 }),
      -1,
      true,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.muted, borderRadius: borderRadius.lg },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  )
}
