import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PageHeader, PageHeaderTitle } from '@/components/ui/page-header'
import { MapDataWrapper } from '@/features/map/components/MapDataWrapper'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

export function MapScreen() {
  const t = useTranslations('map')
  const { colors, spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        header: { paddingHorizontal: spacing[4], paddingVertical: spacing[3] },
        mapContainer: { flex: 1 },
      }),
    [colors, spacing],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View entering={enterUp(0)}>
        <PageHeader style={styles.header}>
          <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        </PageHeader>
      </Animated.View>
      <View style={styles.mapContainer}>
        <MapDataWrapper />
      </View>
    </SafeAreaView>
  )
}
