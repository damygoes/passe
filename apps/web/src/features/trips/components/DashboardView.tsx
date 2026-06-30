'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { buttonVariants } from '@passe/ui/button'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'
import { useAllMemories, useTrips } from '@passe/hooks'
import { NoTripsEmpty } from './NoTripsEmpty'
import { TripCard } from './TripCard'
import { TripStats } from './TripStats'

interface Props {
  locale: string
}

export function DashboardView({ locale }: Props) {
  const t = useTranslations('trips.dashboard')
  const { data: trips = [], isLoading: tripsLoading } = useTrips()
  const { data: allMemories = [], isLoading: memoriesLoading } = useAllMemories()

  if (tripsLoading || memoriesLoading) return null

  const uniqueCountries = new Set(trips.flatMap((trip) => trip.countries))
  const uniqueYears = new Set(trips.map((trip) => new Date(trip.startDate).getFullYear()))
  const uniqueCities = new Set(allMemories.flatMap((memory) => (memory.city ? [memory.city] : [])))

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader>
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        {trips.length > 0 && (
          <PageHeaderDescription>
            {t('description', { tripsCount: trips.length, countriesCount: uniqueCountries.size })}
          </PageHeaderDescription>
        )}
        <PageHeaderAction>
          <Link href={`/${locale}/trips/new`} className={buttonVariants({ size: 'sm' })}>
            {t('new_trip')}
          </Link>
        </PageHeaderAction>
      </PageHeader>

      {trips.length > 0 && (
        <TripStats
          countriesCount={uniqueCountries.size}
          citiesCount={uniqueCities.size}
          yearsCount={uniqueYears.size}
        />
      )}

      {trips.length === 0 ? (
        <NoTripsEmpty locale={locale} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} href={`/${locale}/trips/${trip.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
