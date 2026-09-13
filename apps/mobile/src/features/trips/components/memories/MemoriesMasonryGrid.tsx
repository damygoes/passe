import type { Memory } from '@passe/types/memory'
import { formatMemoryDate } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import { MemoryLayoutMenu } from '@/features/trips/components/editorial/MemoryLayoutMenu'
import { useTheme } from '@/hooks/useTheme'

interface MemoriesMasonryGridProps {
  memories: Memory[]
}

// True masonry (not a fixed-height rotation): each tile keeps its cover
// photo's real aspect ratio, so the varied rhythm comes from the actual
// photos, matching web's CSS-columns masonry. React Native has no columns
// layout, so memories are greedily assigned to whichever of the two columns
// is currently shorter, estimating each tile's rendered height up front.
const FALLBACK_ASPECT_RATIO = 4 / 5
const CAPTION_HEIGHT = 40

export function MemoriesMasonryGrid({ memories }: MemoriesMasonryGridProps) {
  const { colors, fonts, spacing, borderRadius } = useTheme()
  const { width: windowWidth } = useWindowDimensions()

  const columnWidth = (windowWidth - spacing[4] * 2 - spacing[3]) / 2

  const orderedIds = useMemo(() => memories.map((memory) => memory.id), [memories])

  const columns = useMemo(() => {
    const result: { memory: Memory; aspectRatio: number }[][] = [[], []]
    const heights = [0, 0]

    for (const memory of memories) {
      const cover = memory.media[0]
      const aspectRatio =
        cover?.width && cover.height ? cover.width / cover.height : FALLBACK_ASPECT_RATIO
      const tileHeight = columnWidth / aspectRatio + CAPTION_HEIGHT

      const shorterColumn = heights[0]! <= heights[1]! ? 0 : 1
      result[shorterColumn]!.push({ memory, aspectRatio })
      heights[shorterColumn] += tileHeight + spacing[4]
    }

    return result
  }, [memories, columnWidth, spacing])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', gap: spacing[3] },
        column: { flex: 1, gap: spacing[4] },
        photoWrapper: { position: 'relative' },
        photo: {
          width: '100%',
          borderRadius: borderRadius.xl + spacing[1],
          backgroundColor: colors.muted,
        },
        menu: { position: 'absolute', top: spacing[2], right: spacing[2] },
        date: {
          fontFamily: fonts.mono,
          fontSize: 9.5,
          letterSpacing: 0.6,
          color: colors.mutedForeground,
          marginTop: spacing[2] - 1,
        },
        note: { fontSize: 13.5, color: colors.foreground, marginTop: 1 },
      }),
    [colors, fonts, spacing, borderRadius],
  )

  return (
    <View style={styles.row}>
      {columns.map((column, columnIndex) => (
        <View key={columnIndex} style={styles.column}>
          {column.map(({ memory, aspectRatio }) => {
            const cover = memory.media[0]
            return (
              <View key={memory.id}>
                <View style={styles.photoWrapper}>
                  {cover && (
                    <Image
                      source={{ uri: cover.url }}
                      style={[styles.photo, { aspectRatio }]}
                      contentFit="cover"
                    />
                  )}
                  <MemoryLayoutMenu
                    memory={memory}
                    orderedIds={orderedIds}
                    index={orderedIds.indexOf(memory.id)}
                    style={styles.menu}
                  />
                </View>
                <Text style={styles.date}>{formatMemoryDate(memory.capturedAt)}</Text>
                {memory.note && (
                  <Text style={styles.note} numberOfLines={1}>
                    {memory.note}
                  </Text>
                )}
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
