import { useMemo } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

// Mirrors the full-bleed hero layout: an edge-to-edge cover block occupying
// y=0 under the floating nav bar, then a padded description line.
export function TripDetailHeaderSkeleton() {
  const { spacing } = useTheme()
  const { height: windowHeight } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: {
          width: '100%',
          height: Math.round(windowHeight * 0.42),
          borderRadius: 0,
        },
        band: { paddingHorizontal: spacing[4], paddingTop: spacing[4], gap: spacing[2] },
        description: { height: 16, width: '80%' },
        descriptionShort: { height: 16, width: '50%' },
      }),
    [spacing, windowHeight],
  )

  return (
    <View>
      <Skeleton style={styles.hero} />
      <View style={styles.band}>
        <Skeleton style={styles.description} />
        <Skeleton style={styles.descriptionShort} />
      </View>
    </View>
  )
}
