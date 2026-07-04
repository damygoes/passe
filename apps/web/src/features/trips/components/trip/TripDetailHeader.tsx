'use client'

import { Link } from '@/i18n/navigation'
import { routes, tripEditRoute } from '@/lib/routes'
import { useTrip } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'
import { formatTripDateFull } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'

interface Props {
  id: string
}

export function TripDetailHeader({ id }: Props) {
  const t = useTranslations('trips.detail')
  const { data: trip, isLoading, isError } = useTrip(id)

  if (isLoading) return <TripDetailHeaderSkeleton />

  if (isError) return <p className="text-sm text-destructive">{t('trip_error')}</p>

  if (!trip) return <p className="text-sm text-destructive">{t('trip_error')}</p>

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>{trip.title}</PageHeaderTitle>
        <PageHeaderDescription>
          {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
        </PageHeaderDescription>
        <PageHeaderAction className="flex items-center gap-2">
          <Link
            href={routes.dashboard}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {t('back')}
          </Link>
          <Link
            href={tripEditRoute(trip.id)}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            {t('edit')}
          </Link>
        </PageHeaderAction>
      </PageHeader>

      {trip.countries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </div>
      )}

      {trip.coverImageUrl && (
        <div className="relative mt-6 h-56 w-full overflow-hidden rounded-xl sm:h-72 md:h-80">
          <Image
            src={trip.coverImageUrl}
            alt={`Cover photo for ${trip.title}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {trip.description && <p className="mt-4 text-muted-foreground">{trip.description}</p>}
    </>
  )
}
