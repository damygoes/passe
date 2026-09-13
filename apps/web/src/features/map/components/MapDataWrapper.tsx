'use client'

import { useMapPoints, useTrips } from '@passe/hooks'
import { Segmented, SegmentedItem } from '@passe/ui/segmented'
import { Skeleton } from '@passe/ui/skeleton'
import { getUniqueCities, getVisitedCountries } from '@passe/utils'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'

// MapLibre GL touches `window`/`document`, so it can only run on the client.
const WorldMap = dynamic(() => import('./WorldMap').then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[calc(100svh-300px)] min-h-[420px] w-full rounded-[34px]" />
  ),
})

const LEGEND = [
  { key: 'legend_visited', color: '#C4622D' },
  { key: 'legend_pins', color: '#5C6B3A' },
  { key: 'legend_not_yet', color: '#D9C4A0' },
] as const

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { data: points = [], isLoading: pointsLoading, isError: pointsError } = useMapPoints()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const [year, setYear] = useState<string>('all')

  // MapPoint (the lean /map projection) has no capturedAt of its own, so the
  // year filter goes through each point's trip — a trip's startDate year,
  // not a per-memory date. Good enough for "which years did I travel", the
  // filter's actual purpose.
  const tripYearById = useMemo(
    () => new Map(trips.map((trip) => [trip.id, new Date(trip.startDate).getFullYear()])),
    [trips],
  )
  const availableYears = useMemo(
    () =>
      [...new Set(trips.map((trip) => new Date(trip.startDate).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [trips],
  )

  if (pointsLoading || tripsLoading) {
    return <Skeleton className="h-[calc(100svh-300px)] min-h-[420px] w-full rounded-[34px]" />
  }
  if (pointsError || tripsError) {
    return <p className="text-sm text-destructive">{t('load_error')}</p>
  }
  if (points.length === 0) return <NoGeotaggedMemoriesEmpty />

  const filteredPoints =
    year === 'all'
      ? points
      : points.filter((point) => tripYearById.get(point.tripId) === Number(year))
  const filteredTrips =
    year === 'all'
      ? trips
      : trips.filter((trip) => new Date(trip.startDate).getFullYear() === Number(year))

  const { visitedCountries } = getVisitedCountries({ allTrips: filteredTrips })
  const { uniqueCities } = getUniqueCities({
    allMemories: filteredPoints.map((point) => ({ city: point.city ?? null })),
  })
  const yearRange =
    availableYears.length > 1
      ? `${availableYears[availableYears.length - 1]} – ${availableYears[0]}`
      : String(availableYears[0] ?? new Date().getFullYear())

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <div className="mt-2 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            {t('summary', {
              countries: visitedCountries.size,
              cities: uniqueCities.size,
              yearRange,
            })}
          </div>
        </div>
        {availableYears.length > 1 && (
          <Segmented value={year} onValueChange={(value) => setYear(String(value))}>
            <SegmentedItem value="all">{t('filter_all_years')}</SegmentedItem>
            {availableYears.map((y) => (
              <SegmentedItem key={y} value={String(y)}>
                {y}
              </SegmentedItem>
            ))}
          </Segmented>
        )}
      </div>

      <div className="rounded-[34px] bg-secondary p-2">
        <WorldMap points={filteredPoints} visitedCountries={[...visitedCountries]} />
      </div>

      <div className="flex flex-wrap gap-8">
        {LEGEND.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase"
          >
            <span className="size-3 rounded-[4px]" style={{ backgroundColor: item.color }} />
            {t(item.key)}
          </div>
        ))}
      </div>
    </div>
  )
}
