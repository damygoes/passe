import { useMapPoints } from '@passe/hooks'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTranslations } from '@/i18n/useTranslations'
import { spacing } from '@passe/theme'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'
import { WorldMap } from './WorldMap'

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { data: points = [], isLoading, isError, refetch } = useMapPoints()

  if (isLoading) return <Skeleton style={{ flex: 1 }} />
  if (isError) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ padding: spacing[8] }}>
        <ErrorBanner message={t('load_error')} onRetry={() => refetch()} />
      </Animated.View>
    )
  }
  if (points.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1, padding: spacing[8] }}>
        <NoGeotaggedMemoriesEmpty />
      </Animated.View>
    )
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
      <WorldMap points={points} />
    </Animated.View>
  )
}
