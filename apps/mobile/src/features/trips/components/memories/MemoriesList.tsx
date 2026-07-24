import { useMemories } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { EditorialMemories } from '@/features/trips/components/editorial/EditorialMemories'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { MemoriesListSkeleton } from './MemoriesListSkeleton'
import { NoMemoriesEmpty } from './NoMemoriesEmpty'

interface MemoriesListProps {
  tripId: string
}

export function MemoriesList({ tripId }: MemoriesListProps) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { colors, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        headingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[2],
        },
        headingGroup: { flexDirection: 'row', alignItems: 'baseline', gap: spacing[2] },
        addContent: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        addLabel: { fontSize: fontSizes.sm, color: colors.primary },
        heading: {
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        count: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        list: { gap: spacing[4] },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  if (isLoading) return <MemoriesListSkeleton />

  if (isError) return <ErrorBanner message={t('memories_error')} />

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.headingGroup}>
          <Text style={styles.heading}>{t('memories_heading')}</Text>
          {memories.length > 0 && <Text style={styles.count}>{memories.length}</Text>}
        </View>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.push(`/(app)/trips/new-memory/${tripId}`)}
          accessibilityLabel={t('add_memory')}
        >
          <View style={styles.addContent}>
            <Icon name="plus" size="sm" color={colors.primary} />
            <Text style={styles.addLabel}>{t('add_memory')}</Text>
          </View>
        </Button>
      </View>

      {memories.length === 0 ? (
        <NoMemoriesEmpty tripId={tripId} />
      ) : (
        <EditorialMemories memories={memories} />
      )}
    </View>
  )
}
