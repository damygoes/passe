import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { TripCardSkeleton } from '@/features/trips/components/trip/card/TripCardSkeleton'

export function TripsListSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () => StyleSheet.create({ list: { width: '100%', gap: spacing[4] } }),
    [spacing],
  )

  return (
    <View style={styles.list}>
      {Array.from({ length: 4 }, (_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </View>
  )
}
