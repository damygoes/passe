import { useMemories } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { MemoriesMasonryGrid } from './MemoriesMasonryGrid'
import { MemoriesListSkeleton } from './MemoriesListSkeleton'
import { NoMemoriesEmpty } from './NoMemoriesEmpty'

interface MemoriesListProps {
  tripId: string
}

export function MemoriesList({ tripId }: MemoriesListProps) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { colors, fonts, spacing, fontSizes } = useTheme()

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
        heading: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        addContent: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        addLabel: { fontSize: fontSizes.sm, color: colors.primary },
      }),
    [colors, fonts, spacing, fontSizes],
  )

  if (isLoading) return <MemoriesListSkeleton />

  if (isError) return <ErrorBanner message={t('memories_error')} />

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>
          {memories.length} {t('memories_heading')}
        </Text>
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
        <MemoriesMasonryGrid tripId={tripId} memories={memories} />
      )}
    </View>
  )
}
