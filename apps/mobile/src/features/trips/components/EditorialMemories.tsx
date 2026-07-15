import type { Memory } from '@passe/types/memory'
import {
  buildEditorialChapters,
  formatTripDateFull,
  type EditorialSectionVariant,
} from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { MemoryLayoutMenu } from './MemoryLayoutMenu'

interface EditorialMemoriesProps {
  memories: Memory[]
}

function metaLabel(memory: Memory): string {
  return [memory.city, memory.country].filter(Boolean).join(', ')
}

// Read-only editorial rendering of a trip's memories — the mobile
// counterpart of the web trip page. Arranging happens on web.
export function EditorialMemories({ memories }: EditorialMemoriesProps) {
  const t = useTranslations('trips.memory_card')
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = useTheme()
  const { width: windowWidth } = useWindowDimensions()

  const chapters = useMemo(() => buildEditorialChapters(memories), [memories])
  const orderedIds = useMemo(
    () => chapters.flatMap((chapter) => chapter.sections.map((section) => section.memory.id)),
    [chapters],
  )

  // Carousel slides are ~78% of the screen so the next photo peeks in
  const slideWidth = Math.round(windowWidth * 0.78)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[8] },
        chapter: { gap: spacing[5] },
        chapterHeader: { gap: spacing[1] },
        chapterSubtitle: {
          fontSize: fontSizes.xs,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        chapterTitle: {
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        chapterRule: { height: 1, width: 56, backgroundColor: colors.primary },
        section: { gap: spacing[2] },
        photo: { width: '100%', aspectRatio: 16 / 9, borderRadius: borderRadius.xl },
        stackedPhoto: { width: '100%', aspectRatio: 4 / 3, borderRadius: borderRadius.xl },
        photoWrapper: { position: 'relative' },
        countBadge: {
          position: 'absolute',
          right: spacing[2],
          bottom: spacing[2],
          borderRadius: 999,
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          backgroundColor: colors.background,
        },
        countBadgeText: { fontSize: fontSizes.xs, color: colors.foreground },
        captionRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: spacing[3],
        },
        note: { flex: 1, fontSize: fontSizes.sm, color: colors.foreground },
        meta: {
          fontSize: fontSizes.xs,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        stackedNote: {
          fontSize: fontSizes.lg,
          lineHeight: fontSizes.lg * 1.5,
          color: colors.foreground,
        },
        carouselContent: { gap: spacing[3] },
        carouselSlide: { aspectRatio: 4 / 3, borderRadius: borderRadius.xl },
        textSection: { paddingVertical: spacing[4], gap: spacing[3], alignItems: 'center' },
        quote: {
          fontSize: fontSizes.xl,
          lineHeight: fontSizes.xl * 1.5,
          fontStyle: 'italic',
          textAlign: 'center',
          color: colors.foreground,
        },
      }),
    [colors, spacing, fontSizes, fontWeights, borderRadius],
  )

  function renderSection(memory: Memory, variant: EditorialSectionVariant, orderedIndex: number) {
    const meta = metaLabel(memory)
    const date = formatTripDateFull(memory.capturedAt)
    const cover = memory.media[0]

    if (variant === 'text' || !cover) {
      return (
        <View style={styles.textSection}>
          {memory.note && <Text style={styles.quote}>{memory.note}</Text>}
          <Text style={styles.meta}>{[meta, date].filter(Boolean).join(' · ')}</Text>
          <MemoryLayoutMenu
            memory={memory}
            resolvedVariant={variant}
            orderedIds={orderedIds}
            index={orderedIndex}
          />
        </View>
      )
    }

    if (variant === 'carousel') {
      return (
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={slideWidth + spacing[3]}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {memory.media.map((item) => (
              <Image
                key={item.id}
                source={{ uri: item.url }}
                style={[styles.carouselSlide, { width: slideWidth }]}
                contentFit="cover"
                accessibilityLabel={t('photo_alt')}
              />
            ))}
          </ScrollView>
          <View style={styles.captionRow}>
            {memory.note ? <Text style={styles.note}>{memory.note}</Text> : <View />}
            <Text style={styles.meta}>{date}</Text>
          </View>
          <MemoryLayoutMenu
            memory={memory}
            resolvedVariant={variant}
            orderedIds={orderedIds}
            index={orderedIndex}
          />
        </View>
      )
    }

    if (variant === 'hero') {
      return (
        <View style={styles.section}>
          <Image
            source={{ uri: cover.url }}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={t('photo_alt')}
          />
          <View style={styles.captionRow}>
            {memory.note ? (
              <Text style={styles.note}>{memory.note}</Text>
            ) : (
              <Text style={styles.note}>{meta}</Text>
            )}
            <Text style={styles.meta}>{date}</Text>
          </View>
          <MemoryLayoutMenu
            memory={memory}
            resolvedVariant={variant}
            orderedIds={orderedIds}
            index={orderedIndex}
          />
        </View>
      )
    }

    // imageLeft / imageRight — stacked on a phone; side only matters on web
    return (
      <View style={styles.section}>
        <View style={styles.photoWrapper}>
          <Image
            source={{ uri: cover.url }}
            style={styles.stackedPhoto}
            contentFit="cover"
            accessibilityLabel={t('photo_alt')}
          />
          {memory.media.length > 1 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>+{memory.media.length - 1}</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>{[meta, date].filter(Boolean).join(' · ')}</Text>
        {memory.note && <Text style={styles.stackedNote}>{memory.note}</Text>}
        <MemoryLayoutMenu
          memory={memory}
          resolvedVariant={variant}
          orderedIds={orderedIds}
          index={orderedIndex}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {chapters.map((chapter) => (
        <View key={chapter.key} style={styles.chapter}>
          <Animated.View entering={FadeIn.duration(220)} style={styles.chapterHeader}>
            {chapter.subtitle && <Text style={styles.chapterSubtitle}>{chapter.subtitle}</Text>}
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <View style={styles.chapterRule} />
          </Animated.View>
          {chapter.sections.map(({ memory, variant }, index) => (
            <Animated.View
              key={memory.id}
              entering={FadeInDown.delay(Math.min(index * 50, 300)).duration(220)}
            >
              {renderSection(memory, variant, orderedIds.indexOf(memory.id))}
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  )
}
