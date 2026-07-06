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
import { useEffect, useRef, useState } from 'react'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'

interface Props {
  id: string
}

export function TripDetailHeader({ id }: Props) {
  const t = useTranslations('trips.detail')
  const { data: trip, isLoading, isError } = useTrip(id)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight)
    }
  }, [trip?.coverImageUrl])

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
        <div
          className="relative mx-auto mt-6 max-w-full overflow-hidden rounded-xl bg-muted"
          style={{
            height: 'min(70vh, 40rem)',
            aspectRatio: aspectRatio ?? undefined,
            width: aspectRatio ? 'auto' : '100%',
          }}
        >
          <Image
            ref={imgRef}
            src={trip.coverImageUrl}
            alt={`Cover photo for ${trip.title}`}
            fill
            priority
            className="object-contain"
            sizes="100vw"
            onLoad={(event) => {
              const img = event.currentTarget
              if (img.naturalWidth && img.naturalHeight) {
                setAspectRatio(img.naturalWidth / img.naturalHeight)
              }
            }}
          />
        </div>
      )}

      {trip.description && <p className="mt-4 text-muted-foreground">{trip.description}</p>}
    </>
  )
}
