'use client'

import { tripRoute } from '@/lib/routes'
import { useTrips } from '@passe/hooks'
import { Skeleton } from '@passe/ui'
import { useTranslations } from 'next-intl'
import { NoTripsEmpty } from './NoTripsEmpty'
import { TripCard } from './TripCard'

function TripsListSkeleton() {
  return <Skeleton className="h-96 w-full" />
}

export function TripsList() {
  const { data: trips = [], isLoading, isError } = useTrips()
  const t = useTranslations('trips.dashboard')

  if (isLoading) {
    return <TripsListSkeleton />
  }

  if (isError) {
    return <p className="text-sm text-destructive">{t('trips_error')}</p>
  }

  if (trips.length === 0) {
    return <NoTripsEmpty />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} href={tripRoute(trip.id)} />
      ))}
    </div>
  )
}
