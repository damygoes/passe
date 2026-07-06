import { useAllMemories } from '@passe/hooks'
import { Text } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'
import { WorldMap, type MapPoint } from './WorldMap'

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { colors } = useTheme()
  const { data: allMemories = [], isLoading, isError } = useAllMemories()

  if (isLoading) return <Skeleton style={{ flex: 1 }} />
  if (isError) return <Text style={{ color: colors.destructive }}>{t('load_error')}</Text>

  const points: MapPoint[] = allMemories.reduce<MapPoint[]>((accumulator, memory) => {
    if (!memory.location) return accumulator
    accumulator.push({
      id: memory.id,
      tripId: memory.tripId,
      lat: memory.location.lat,
      lng: memory.location.lng,
      city: memory.city,
      country: memory.country,
      note: memory.note,
    })
    return accumulator
  }, [])

  if (points.length === 0) return <NoGeotaggedMemoriesEmpty />

  return <WorldMap points={points} />
}
