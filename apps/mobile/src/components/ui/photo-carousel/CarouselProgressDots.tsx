import { StyleSheet, View, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'
import { createPhotoCarouselRecipe } from '@/recipes/photo-carousel'

// Above this many photos the design drops the dots in favor of the count
// pill + thumbnail strip rather than a windowed dot set.
const MAX_VISIBLE_DOTS = 8

interface DotProps {
  active: boolean
  baseStyle: ViewStyle
  activeWidth: number
  inactiveWidth: number
}

// One component instance per dot so each owns its own useAnimatedStyle call
// unconditionally — calling that hook inside the parent's .map() would
// break the rules of hooks whenever the photo count changes between renders.
function Dot({ active, baseStyle, activeWidth, inactiveWidth }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? activeWidth : inactiveWidth, { duration: 200 }),
    opacity: withTiming(active ? 1 : 0.45, { duration: 200 }),
  }))
  return <Animated.View style={[baseStyle, animatedStyle]} />
}

interface CarouselProgressDotsProps {
  count: number
  selectedIndex: number
}

// Indicator-only, deliberately not tappable — selection is already covered
// by the tap zones and thumbnail strip, so making dots interactive would
// otherwise need a >=44pt transparent hit area per the design spec.
export function CarouselProgressDots({ count, selectedIndex }: CarouselProgressDotsProps) {
  const theme = useTheme()
  const recipe = createPhotoCarouselRecipe(theme)

  if (count > MAX_VISIBLE_DOTS) return null

  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <Dot
          key={index}
          active={index === selectedIndex}
          baseStyle={recipe.dots.base}
          activeWidth={recipe.dots.activeWidth}
          inactiveWidth={recipe.dots.inactiveWidth}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
})
