import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

// Mirrors the full-bleed hero + overlapping info-card layout.
export function TripDetailHeaderSkeleton() {
  const { spacing, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: { width: '100%', height: 270, borderRadius: 0 },
        card: {
          marginTop: -42,
          marginHorizontal: spacing[4],
          borderRadius: borderRadius.xl + spacing[2],
          padding: spacing[5],
          gap: spacing[3],
        },
        date: { height: 12, width: 140 },
        title: { height: 34, width: '70%' },
        tags: { height: 24, width: '90%' },
        buttons: { height: 44, width: '100%' },
      }),
    [spacing, borderRadius],
  )

  return (
    <View>
      <Skeleton style={styles.hero} />
      <View style={styles.card}>
        <Skeleton style={styles.date} />
        <Skeleton style={styles.title} />
        <Skeleton style={styles.tags} />
        <Skeleton style={styles.buttons} />
      </View>
    </View>
  )
}
