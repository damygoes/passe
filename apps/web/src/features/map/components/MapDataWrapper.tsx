'use client'

import { useMapPoints, useTrips } from '@passe/hooks'
import { Skeleton } from '@passe/ui/skeleton'
import { getVisitedCountries } from '@passe/utils'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'

// MapLibre GL touches `window`/`document`, so it can only run on the client.
const WorldMap = dynamic(() => import('./WorldMap').then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <Skeleton className="h-[70vh] w-full rounded-xl" />,
})

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { data: points = [], isLoading: pointsLoading, isError: pointsError } = useMapPoints()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()

  if (pointsLoading || tripsLoading) return <Skeleton className="h-[70vh] w-full rounded-xl" />
  if (pointsError || tripsError)
    return <p className="text-sm text-destructive">{t('load_error')}</p>
  if (points.length === 0) return <NoGeotaggedMemoriesEmpty />

  const { visitedCountries } = getVisitedCountries({ allTrips: trips })

  return <WorldMap points={points} visitedCountries={[...visitedCountries]} />
}
