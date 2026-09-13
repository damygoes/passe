import { queryKeys } from '@passe/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { PageHeader, PageHeaderTitle } from '@/components/ui/page-header'
import { Segmented } from '@/components/ui/segmented'
import { TripsList, type TripsFilter } from '@/features/trips/components/trip/lists/TripsList'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

export function TripsScreen() {
  const t = useTranslations('trips.list')
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<TripsFilter>('all')

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([
      queryClient.refetchQueries({ queryKey: queryKeys.trips() }),
      queryClient.refetchQueries({ queryKey: queryKeys.allMemories() }),
    ])
    setRefreshing(false)
  }, [queryClient])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scroll: { flex: 1 },
        scrollContent: { padding: spacing[4], paddingTop: spacing[2], flexGrow: 1 },
        stickyHeader: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[2],
          paddingBottom: spacing[3],
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
        },
        title: { fontSize: fontSizes['3xl'] },
        addButton: {
          width: 44,
          height: 44,
          paddingHorizontal: 0,
          paddingVertical: 0,
          borderRadius: borderRadius.full,
        },
        segmented: { marginTop: spacing[4] + 2, marginBottom: spacing[2] },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View entering={enterUp(0)} style={styles.stickyHeader}>
        <PageHeader style={styles.header}>
          <PageHeaderTitle style={styles.title}>{t('title')}</PageHeaderTitle>
          <View>
            <Button
              variant="primary"
              style={styles.addButton}
              onPress={() => router.push('/(app)/trips/new')}
              accessibilityLabel={t('new_trip')}
            >
              <Icon name="plus" size="md" color={colors.primaryForeground} />
            </Button>
          </View>
        </PageHeader>
      </Animated.View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Segmented
          style={styles.segmented}
          value={filter}
          onValueChange={(value) => setFilter(value as TripsFilter)}
          options={[
            { value: 'all', label: t('filter_all') },
            { value: 'private', label: t('filter_private') },
            { value: 'shared', label: t('filter_shared') },
          ]}
        />
        <TripsList filter={filter} />
      </ScrollView>
    </SafeAreaView>
  )
}
