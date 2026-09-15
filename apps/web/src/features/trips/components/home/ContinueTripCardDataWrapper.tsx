'use client'

import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { tripRoute } from '@/lib/routes'
import { useAllMemories, useTrips } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { Skeleton } from '@passe/ui/skeleton'
import { formatDateRange, getMostRecentTrip, getUniqueCities } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { TripCardCoverFallback } from '../trip/card/TripCardCoverFallback'
import { NoTripsEmpty } from '../trip/empty/NoTripsEmpty'

export function ContinueTripCardDataWrapper() {
  const t = useTranslations('trips.home')
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

  if (tripsLoading || memoriesLoading) {
    return <Skeleton className="h-[420px] w-full rounded-[32px]" />
  }

  if (tripsError || memoriesError) return null
  if (trips.length === 0) return <NoTripsEmpty />

  const trip = getMostRecentTrip(trips)
  if (!trip) return null

  const tripMemories = allMemories.filter((memory) => memory.tripId === trip.id)
  const isShared = tripMemories.some((memory) => memory.isPublic)
  const { uniqueCities } = getUniqueCities({ allMemories: tripMemories })
  const notelessCount = tripMemories.filter((memory) => !memory.note?.trim()).length
  const description = [
    [...uniqueCities].join(', '),
    t('noteless_memories', { count: notelessCount }),
  ]
    .filter(Boolean)
    .join('. ')

  return (
    <Link
      href={tripRoute(trip.id)}
      className="block overflow-hidden rounded-[32px] bg-popover shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="washed relative h-[300px] w-full">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 62vw"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        ) : (
          <TripCardCoverFallback title={trip.title} />
        )}
      </div>
      <div className="p-7">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl">{trip.title}</h2>
          <Badge variant={isShared ? 'shared' : 'private'} className="font-mono uppercase">
            {isShared ? t('shared_tag') : t('private_tag')}
          </Badge>
        </div>
        <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          {t('continue_meta', {
            dateRange: formatDateRange(trip.startDate, trip.endDate),
            count: tripMemories.length,
          })}
        </div>
        {description && <p className="mt-3 text-[15px] text-muted-foreground">{description}</p>}
      </div>
    </Link>
  )
}
