import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function TripDetailHeaderSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        title: { height: 28, width: '60%' },
        dates: { height: 16, width: '40%' },
        badges: { flexDirection: 'row', gap: spacing[1] },
        badge: { height: 20, width: 56, borderRadius: 999 },
        cover: { width: '100%', aspectRatio: 16 / 9 },
      }),
    [spacing],
  )

  return (
    <View style={styles.container}>
      <Skeleton style={styles.title} />
      <Skeleton style={styles.dates} />
      <View style={styles.badges}>
        <Skeleton style={styles.badge} />
        <Skeleton style={styles.badge} />
      </View>
      <Skeleton style={styles.cover} />
    </View>
  )
}
