import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { MemoryCardSkeleton } from './MemoryCardSkeleton'

export function MemoriesListSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        heading: { height: 20, width: 96 },
      }),
    [spacing],
  )

  return (
    <View style={styles.container}>
      <Skeleton style={styles.heading} />
      {Array.from({ length: 3 }, (_, i) => (
        <MemoryCardSkeleton key={i} />
      ))}
    </View>
  )
}
