import { useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MemoriesList } from '@/features/trips/components/memories/MemoriesList'
import { TripDetailHeader } from '@/features/trips/components/trip/trip-detail/TripDetailHeader'
import { useTheme } from '@/hooks/useTheme'
import { enterFade, enterUp } from '@/lib/motion'

export function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, spacing } = useTheme()

  const scrollY = useSharedValue(0)
  const restOffset = useSharedValue<number | null>(null)
  const scrollHandler = useAnimatedScrollHandler({
    // react-native-screens can settle this scroll view at a negative offset
    // under the transparent nav bar, and Fabric reports contentInset as zeros
    // in scroll events — so the raw offset's zero point can't be trusted.
    // Capture the true resting offset the moment the user first touches
    // (before the drag has moved anything) and keep scrollY gesture-relative;
    // until then it stays 0 and the hero renders untransformed.
    onBeginDrag: (event) => {
      if (restOffset.value === null) restOffset.value = event.contentOffset.y
    },
    onScroll: (event) => {
      if (restOffset.value !== null) scrollY.value = event.contentOffset.y - restOffset.value
    },
  })

  // iOS natively insets this scroll view's content below the transparent nav
  // bar even with contentInsetAdjustmentBehavior="never" (react-native-screens
  // + iOS 26 behavior), which would leave a background band above the hero.
  // Measure where the first content child actually lands on screen at rest and
  // pull it up by exactly that amount — zero on platforms that don't inset.
  const bleedRef = useRef<View>(null)
  const [topBleed, setTopBleed] = useState(0)
  const measureTopBleed = useCallback(() => {
    bleedRef.current?.measureInWindow((_x, y) => {
      if (y > 0.5) setTopBleed((current) => current + y)
    })
  }, [])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        bleed: { marginTop: -topBleed },
        // The hero bleeds edge-to-edge, so padding lives on the content band
        // below it rather than on the scroll container.
        content: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[8],
          paddingBottom: spacing[4],
        },
      }),
    [colors, spacing, topBleed],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'never' : undefined}
      >
        <Animated.View
          ref={bleedRef}
          onLayout={measureTopBleed}
          entering={enterFade(0)}
          style={styles.bleed}
        >
          <TripDetailHeader id={id} scrollY={scrollY} />
        </Animated.View>
        <Animated.View entering={enterUp(80)} style={styles.content}>
          <MemoriesList tripId={id} />
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}
