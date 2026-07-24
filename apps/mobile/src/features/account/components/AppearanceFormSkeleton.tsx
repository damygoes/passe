import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function AppearanceFormSkeleton() {
  const { spacing, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        grid: { flexDirection: 'row', gap: spacing[4] },
        card: { flex: 1, height: 176, borderRadius: borderRadius.xl },
      }),
    [spacing, borderRadius],
  )

  return (
    <View style={styles.grid}>
      <Skeleton style={styles.card} />
      <Skeleton style={styles.card} />
    </View>
  )
}
