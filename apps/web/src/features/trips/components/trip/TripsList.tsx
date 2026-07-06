'use client'

import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { tripRoute } from '@/lib/routes'
import { useTrips } from '@passe/hooks'
import { useTranslations } from 'next-intl'
import { NoTripsEmpty } from './NoTripsEmpty'
import { TripCard } from './TripCard'
import { TripsListSkeleton } from './TripsListSkeleton'

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
    <Stagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip, index) => (
        <StaggerItem key={trip.id}>
          <TripCard
            trip={trip}
            href={tripRoute(trip.id)}
            tilt={index % 2 === 0 ? 'left' : 'right'}
          />
        </StaggerItem>
      ))}
    </Stagger>
  )
}
