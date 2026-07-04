import { useTrip } from '@passe/hooks'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { TripForm } from '@/features/trips/components/TripForm'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const t = useTranslations('trips.edit')
  const tDetail = useTranslations('trips.detail')
  const { data: trip, isLoading, isError } = useTrip(id)
  const { spacing } = useTheme()

  const styles = useMemo(
    () => StyleSheet.create({ loading: { gap: spacing[4] }, field: { height: 56, width: '100%' } }),
    [spacing],
  )

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
      {isLoading ? (
        <View style={styles.loading}>
          <Skeleton style={styles.field} />
          <Skeleton style={styles.field} />
          <Skeleton style={styles.field} />
        </View>
      ) : isError || !trip ? (
        <ErrorBanner message={tDetail('trip_error')} />
      ) : (
        <TripForm trip={trip} />
      )}
    </AccountFormLayout>
  )
}
