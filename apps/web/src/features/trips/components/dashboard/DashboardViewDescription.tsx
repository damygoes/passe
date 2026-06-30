'use client'

import { useTrips } from '@passe/hooks'
import { PageHeaderDescription, Skeleton } from '@passe/ui'
import { useTranslations } from 'next-intl'
import { getUniqueStatsFromTrip } from '../../utils/getUniqueStatsFromTrips'

type TFunction = ReturnType<typeof useTranslations>

export function DashboardViewDescription({ t }: { t: TFunction }) {
  const { data: trips = [], isLoading, isError } = useTrips()
  const { uniqueCountries } = getUniqueStatsFromTrip({ trips })

  if (isLoading) {
    return <Skeleton className="h-5 w-24" />
  }

  if (isError) {
    return null
  }

  return (
    <PageHeaderDescription>
      {t('description', { tripsCount: trips.length, countriesCount: uniqueCountries.size })}
    </PageHeaderDescription>
  )
}
