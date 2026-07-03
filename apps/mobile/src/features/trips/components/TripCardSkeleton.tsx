import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function TripCardSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        cover: { width: '100%', aspectRatio: 16 / 9, borderRadius: 0 },
        body: { padding: spacing[4], gap: spacing[2] },
        title: { height: 16, width: '75%' },
        date: { height: 12, width: '50%' },
        badges: { flexDirection: 'row', gap: spacing[1], marginTop: spacing[2] },
        badge: { height: 20, width: 56, borderRadius: 999 },
      }),
    [spacing],
  )

  return (
    <Card>
      <Skeleton style={styles.cover} />
      <View style={styles.body}>
        <Skeleton style={styles.title} />
        <Skeleton style={styles.date} />
        <View style={styles.badges}>
          <Skeleton style={styles.badge} />
          <Skeleton style={styles.badge} />
        </View>
      </View>
    </Card>
  )
}
