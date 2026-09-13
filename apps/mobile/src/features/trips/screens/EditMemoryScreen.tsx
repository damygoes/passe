import { useMemories } from '@passe/hooks'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { EditMemoryForm } from '@/features/trips/components/memories/EditMemoryForm'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function EditMemoryScreen() {
  const { id, tripId } = useLocalSearchParams<{ id: string; tripId: string }>()
  const t = useTranslations('trips.edit_memory')
  const { data: memories, isLoading, isError } = useMemories(tripId)
  const { spacing } = useTheme()

  const memory = memories?.find((candidate) => candidate.id === id)

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
      ) : isError || !memory ? (
        <ErrorBanner message={t('not_found')} />
      ) : (
        <EditMemoryForm tripId={tripId} memory={memory} />
      )}
    </AccountFormLayout>
  )
}
