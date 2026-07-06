import { useEffect } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import type { TextInputProps } from 'react-native'
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

import type { AnimatedNumberProps } from './AnimatedNumber.types'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

/**
 * Ticks a number up from 0 to its final value on the UI thread. Rendered
 * through a non-editable TextInput because Text content cannot be driven by
 * animatedProps. Respects the system reduce-motion setting (jumps straight
 * to the final value).
 */
export function AnimatedNumber({ value, delayMs = 0, style }: AnimatedNumberProps) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withTiming(value, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
      ReduceMotion.System,
    )
  }, [value, delayMs, progress])

  const animatedProps = useAnimatedProps(() => {
    const text = String(Math.round(progress.value))
    // `text` is a valid native prop on TextInput but missing from its TS types
    return { text, defaultValue: text } as unknown as TextInputProps
  })

  return (
    <AnimatedTextInput
      editable={false}
      pointerEvents="none"
      underlineColorAndroid="transparent"
      animatedProps={animatedProps}
      accessibilityLabel={String(value)}
      style={[styles.input, style]}
    />
  )
}

const styles = StyleSheet.create({
  input: { padding: 0 },
})
