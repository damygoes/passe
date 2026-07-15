import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function MemoryCardSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        photo: { width: '100%', aspectRatio: 16 / 9, borderRadius: 0 },
        body: { padding: spacing[4], gap: spacing[2] },
        location: { height: 12, width: '40%' },
        note: { height: 14, width: '90%' },
      }),
    [spacing],
  )

  return (
    <Card>
      <Skeleton style={styles.photo} />
      <View style={styles.body}>
        <Skeleton style={styles.location} />
        <Skeleton style={styles.note} />
      </View>
    </Card>
  )
}
