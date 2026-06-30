'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { PageHeader, PageHeaderAction, PageHeaderTitle } from '@passe/ui/page-header'
import { useTranslations } from 'next-intl'
import { TripsList } from '../trip/TripsList'
import { TripStatsDataWrapper } from '../trip/TripStatsDataWrapper'
import { DashboardViewDescription } from './DashboardViewDescription'

export function DashboardView() {
  const t = useTranslations('trips.dashboard')

  return (
    <div className="container mx-auto w-full px-4 py-8 flex flex-col justify-start items-center gap-6">
      <PageHeader className="w-full">
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        <DashboardViewDescription t={t} />
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
