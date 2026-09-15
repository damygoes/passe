import { Image } from 'expo-image'
import { useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { PressableScale } from '@/components/ui/pressable-scale'
import { useTheme } from '@/hooks/useTheme'
import { createPhotoCarouselRecipe } from '@/recipes/photo-carousel'
import type { PhotoCarouselItem } from './PhotoCarousel.types'

const THUMB_SIZE = 62
const THUMB_GAP = 9

interface ThumbnailStripProps {
  photos: PhotoCarouselItem[]
  selectedIndex: number
  onSelect: (index: number) => void
  onAddPhotos: () => void
  addLabel: string
}

export function ThumbnailStrip({
  photos,
  selectedIndex,
  onSelect,
  onAddPhotos,
  addLabel,
}: ThumbnailStripProps) {
  const theme = useTheme()
  const recipe = createPhotoCarouselRecipe(theme)
  const scrollRef = useRef<ScrollView>(null)

  // Fixed thumb size means the active thumb's offset is directly computable
  // from its index — no onLayout measurement round-trip needed.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: Math.max(0, selectedIndex * (THUMB_SIZE + THUMB_GAP) - THUMB_SIZE),
      animated: true,
    })
  }, [selectedIndex])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {photos.map((photo, index) => {
        const isActive = index === selectedIndex
        return (
          <PressableScale
            key={photo.id}
            haptic={false}
            onPress={() => onSelect(index)}
            accessibilityRole="imagebutton"
            accessibilityLabel={photo.caption ?? undefined}
          >
            <View style={[recipe.thumbnail.base, isActive && recipe.thumbnail.activeRing]}>
              <Image
                source={{ uri: photo.url }}
                placeholder={photo.placeholder ? { uri: photo.placeholder } : undefined}
                style={[StyleSheet.absoluteFill, !isActive && recipe.thumbnail.inactive]}
                contentFit="cover"
              />
            </View>
          </PressableScale>
        )
      })}
      <PressableScale haptic={false} onPress={onAddPhotos} accessibilityLabel={addLabel}>
        <View style={recipe.thumbnail.addTile}>
          <Icon name="plus" size="sm" color={theme.palette.terracotta[700]} />
          <Text style={recipe.thumbnail.addLabel}>{addLabel}</Text>
        </View>
      </PressableScale>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { flexDirection: 'row', gap: THUMB_GAP, paddingHorizontal: 26, paddingTop: 16 },
})
