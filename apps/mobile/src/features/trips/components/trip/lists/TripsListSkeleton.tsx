import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

function TripRowSkeleton({ showDivider }: { showDivider: boolean }) {
  const { colors, spacing, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3] + 2,
          paddingVertical: spacing[4],
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: colors.border,
        },
        thumb: { width: 82, height: 82, borderRadius: borderRadius.xl + spacing[1] },
        content: { flex: 1, gap: spacing[2] },
      }),
    [colors, spacing, borderRadius, showDivider],
  )

  return (
    <View style={styles.row}>
      <Skeleton style={styles.thumb} />
      <View style={styles.content}>
        <Skeleton style={{ height: 22, width: '60%' }} />
        <Skeleton style={{ height: 14, width: '40%' }} />
        <Skeleton style={{ height: 14, width: '75%' }} />
      </View>
    </View>
  )
}

export function TripsListSkeleton() {
  return (
    <View style={{ width: '100%' }}>
      {Array.from({ length: 4 }, (_, index) => (
        <TripRowSkeleton key={index} showDivider={index < 3} />
      ))}
    </View>
  )
}
