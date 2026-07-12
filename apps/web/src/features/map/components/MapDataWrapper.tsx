'use client'

import { useMapPoints } from '@passe/hooks'
import { Skeleton } from '@passe/ui/skeleton'
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
  const { data: points = [], isLoading, isError } = useMapPoints()

  if (isLoading) return <Skeleton className="h-[70vh] w-full rounded-xl" />
  if (isError) return <p className="text-sm text-destructive">{t('load_error')}</p>
  if (points.length === 0) return <NoGeotaggedMemoriesEmpty />

  return <WorldMap points={points} />
}
