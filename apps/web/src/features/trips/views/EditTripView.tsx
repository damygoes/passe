'use client'

import { Link } from '@/i18n/navigation'
import { tripRoute } from '@/lib/routes'
import { useTrip } from '@passe/hooks'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { Skeleton } from '@passe/ui/skeleton'
import { useTranslations } from 'next-intl'
import { TripForm } from '../components/trip/forms/TripForm'

interface Props {
  id: string
}

export function EditTripView({ id }: Props) {
  const t = useTranslations('trips.edit')
  const tDetail = useTranslations('trips.detail')
  const { data: trip, isLoading, isError } = useTrip(id)

  return (
    <div className="container mx-auto w-full max-w-2xl px-4 py-8 flex flex-col gap-6">
      <Link href={tripRoute(id)} className="text-sm text-muted-foreground hover:text-foreground">
        {t('back')}
      </Link>
      <PageHeader>
        <PageHeaderTitle>{t('title')}</PageHeaderTitle>
        <PageHeaderDescription>{t('subtitle')}</PageHeaderDescription>
      </PageHeader>
      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError || !trip ? (
        <p className="text-sm text-destructive">{tDetail('trip_error')}</p>
      ) : (
        <TripForm trip={trip} />
      )}
    </div>
  )
}
