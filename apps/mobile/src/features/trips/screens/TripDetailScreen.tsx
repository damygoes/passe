import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ScrapbookTexture } from '@/components/ui/scrapbook-texture'
import { MemoriesList } from '@/features/trips/components/memories/MemoriesList'
import { TripDetailHeader } from '@/features/trips/components/trip/trip-detail/TripDetailHeader'
import { TripDetailNavBar } from '@/features/trips/components/trip/trip-detail/TripDetailNavBar'
import { useTheme } from '@/hooks/useTheme'
import { enterFade, enterUp } from '@/lib/motion'
import { ScrapbookThemeProvider } from '@/theme/ScrapbookThemeContext'

// This screen hides the native stack header (see the trips _layout) and renders
// TripDetailNavBar over the hero instead — react-native-screens on iOS 26
// devices clips content that tries to bleed under a transparent native header.
// With no header, the scroll content starts at the true top of the screen.
//
// Wraps the themed content in the user's opt-in scrapbook preference, scoped
// to just this screen — mirrors web's `UserThemeScope` around TripDetailView.
export function TripDetailScreen() {
  return (
    <ScrapbookThemeProvider>
      <TripDetailScreenContent />
    </ScrapbookThemeProvider>
  )
}

function TripDetailScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, spacing, isScrapbook } = useTheme()

  const scrollY = useSharedValue(0)
  const restOffset = useSharedValue<number | null>(null)
  const scrollHandler = useAnimatedScrollHandler({
    // iOS can settle this scroll view at a non-zero offset at rest, and a raw
    // offset would leave the hero's stretch/parallax transforms engaged while
    // idle (zoomed hero, title pushed off-screen). Capture the true resting
    // offset the moment the user first touches (before the drag has moved
    // anything) and keep scrollY gesture-relative; until then it stays 0 and
    // the hero renders untransformed.
    onBeginDrag: (event) => {
      if (restOffset.value === null) restOffset.value = event.contentOffset.y
    },
    onScroll: (event) => {
      if (restOffset.value !== null) scrollY.value = event.contentOffset.y - restOffset.value
    },
  })

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        // The hero bleeds edge-to-edge, so padding lives on the content band
        // below it rather than on the scroll container.
        content: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[8],
          paddingBottom: spacing[4],
        },
      }),
    [colors, spacing],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'never' : undefined}
      >
        {isScrapbook && <ScrapbookTexture />}
        <Animated.View entering={enterFade(0)}>
          <TripDetailHeader id={id} scrollY={scrollY} />
        </Animated.View>
        <Animated.View entering={enterUp(80)} style={styles.content}>
          <MemoriesList tripId={id} />
        </Animated.View>
      </Animated.ScrollView>
      <TripDetailNavBar />
    </SafeAreaView>
  )
}
