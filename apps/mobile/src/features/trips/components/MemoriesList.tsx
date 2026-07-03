import { useMemories } from '@passe/hooks'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { MemoriesListSkeleton } from './MemoriesListSkeleton'
import { MemoryCard } from './MemoryCard'
import { NoMemoriesEmpty } from './NoMemoriesEmpty'

interface MemoriesListProps {
  tripId: string
}

export function MemoriesList({ tripId }: MemoriesListProps) {
  const t = useTranslations('trips.detail')
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { colors, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        headingRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing[2] },
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
        <Text style={styles.heading}>{t('memories_heading')}</Text>
        {memories.length > 0 && <Text style={styles.count}>{memories.length}</Text>}
      </View>

      {memories.length === 0 ? (
        <NoMemoriesEmpty />
      ) : (
        <View style={styles.list}>
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </View>
      )}
    </View>
  )
}
