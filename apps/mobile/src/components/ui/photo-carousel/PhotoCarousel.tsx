import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { createPhotoCarouselRecipe } from '@/recipes/photo-carousel'
import { CarouselCountPill } from './CarouselCountPill'
import { CarouselProgressDots } from './CarouselProgressDots'
import type { PhotoCarouselProps } from './PhotoCarousel.types'

// Fallback width before the container's first onLayout measurement lands —
// avoids a flash of zero-width pages on mount.
const { width: WINDOW_WIDTH } = Dimensions.get('window')
// How long a programmatic scrollTo (triggered by the thumbnail strip) takes
// to settle — momentum events during this window are ignored so they don't
// feed back into onIndexChange as if the user had swiped.
const PROGRAMMATIC_SCROLL_SETTLE_MS = 350

export function PhotoCarousel({
  photos,
  selectedIndex,
  onIndexChange,
  height = 430,
  topInset = 0,
  countLabel,
  prevLabel,
  nextLabel,
}: PhotoCarouselProps) {
  const theme = useTheme()
  const recipe = createPhotoCarouselRecipe(theme)
  const scrollRef = useRef<ScrollView>(null)
  const isProgrammaticScroll = useRef(false)
  const [width, setWidth] = useState(WINDOW_WIDTH)

  // Keep the pager in sync when selection changes from outside (thumbnail
  // tap, prev/next tap zone, cover set) rather than from the user swiping.
  useEffect(() => {
    isProgrammaticScroll.current = true
    scrollRef.current?.scrollTo({ x: selectedIndex * width, animated: true })
    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, PROGRAMMATIC_SCROLL_SETTLE_MS)
    return () => clearTimeout(timeout)
  }, [selectedIndex, width])

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width)
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isProgrammaticScroll.current) return
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    if (nextIndex !== selectedIndex && nextIndex >= 0 && nextIndex < photos.length) {
      onIndexChange(nextIndex)
    }
  }

  function stepBack() {
    onIndexChange((selectedIndex - 1 + photos.length) % photos.length)
  }

  function stepForward() {
    onIndexChange((selectedIndex + 1) % photos.length)
  }

  return (
    <View style={[styles.container, recipe.hero.container, { height }]} onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {photos.map((photo) => (
          <View key={photo.id} style={{ width, height }}>
            <Image
              source={{ uri: photo.url }}
              placeholder={photo.placeholder ? { uri: photo.placeholder } : undefined}
              style={recipe.hero.image}
              contentFit="cover"
              accessibilityLabel={photo.caption ?? undefined}
            />
            <View style={[StyleSheet.absoluteFill, recipe.hero.washOverlay]} pointerEvents="none" />
          </View>
        ))}
      </ScrollView>

      {photos.length > 1 && (
        <>
          <Pressable
            onPress={stepBack}
            style={[recipe.tapZone, styles.tapZoneLeft]}
            accessibilityRole="button"
            accessibilityLabel={prevLabel}
          />
          <Pressable
            onPress={stepForward}
            style={[recipe.tapZone, styles.tapZoneRight]}
            accessibilityRole="button"
            accessibilityLabel={nextLabel}
          />
        </>
      )}

      <View style={[styles.pillContainer, { top: 18 + topInset }]}>
        <CarouselCountPill label={countLabel} />
      </View>

      {photos.length > 1 && (
        <View style={styles.dotsContainer}>
          <CarouselProgressDots count={photos.length} selectedIndex={selectedIndex} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  tapZoneLeft: { left: 0 },
  tapZoneRight: { right: 0 },
  pillContainer: { position: 'absolute', right: 18 },
  dotsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
