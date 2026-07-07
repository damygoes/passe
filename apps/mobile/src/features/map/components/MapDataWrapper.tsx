import { useMapPoints } from '@passe/hooks'
import { Text } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { spacing } from '@passe/theme'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'
import { WorldMap } from './WorldMap'

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { colors } = useTheme()
  const { data: points = [], isLoading, isError } = useMapPoints()

  if (isLoading) return <Skeleton style={{ flex: 1 }} />
  if (isError) return <Text style={{ color: colors.destructive }}>{t('load_error')}</Text>
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
