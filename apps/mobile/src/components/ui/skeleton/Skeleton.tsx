import { useTheme } from '@/hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import type { SkeletonProps } from './Skeleton.types'

export function Skeleton({ style, ...props }: SkeletonProps) {
  const { colors, borderRadius } = useTheme()
  const [width, setWidth] = useState(0)
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, reduceMotion: ReduceMotion.System }),
      -1,
      false,
    )
  }, [progress])

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value * 2 - 1) * width }],
  }))

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[
        {
          backgroundColor: colors.muted,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}
    >
      <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
        <LinearGradient
          colors={[`${colors.foreground}00`, `${colors.foreground}14`, `${colors.foreground}00`]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}
