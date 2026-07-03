'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useTrips } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'
import { Skeleton } from '@passe/ui/skeleton'
import { getUniqueStatsFromTrips } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { TripsList } from '../components/trip/TripsList'
import { TripStatsDataWrapper } from '../components/trip/TripStatsDataWrapper'

export function DashboardView() {
  const t = useTranslations('trips.dashboard')
  const { data: trips = [], isLoading, isError } = useTrips()
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips })

  return (
    <div className="container mx-auto w-full px-4 py-8 flex flex-col justify-start items-center gap-6">
      <PageHeader className="w-full">
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        {isLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : !isError ? (
          <PageHeaderDescription>
            {t('description', { tripsCount: trips.length, countriesCount: uniqueCountries.size })}
          </PageHeaderDescription>
        ) : null}
        <PageHeaderAction>
          <Link href={routes.tripsNew} className={buttonVariants({ size: 'sm' })}>
            {t('new_trip')}
          </Link>
        </PageHeaderAction>
      </PageHeader>
      <TripStatsDataWrapper />
      <TripsList />
    </div>
  )
}
