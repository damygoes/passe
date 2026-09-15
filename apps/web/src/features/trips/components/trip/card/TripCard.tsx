'use client'

import { TripCardCoverFallback } from '@/features/trips/components/trip/card/TripCardCoverFallback'
import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { Badge } from '@passe/ui/badge'
import { formatDateRange } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface TripCardData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  coverImageUrl?: string | null
  coverImagePlaceholder?: string | null
  coverImageSrcset?: Record<string, string> | null
}

interface Props {
  trip: TripCardData
  /** Cities across the trip's memories — shown as a plain text line, not badges. */
  cities: string[]
  isShared: boolean
  href?: string
}

export function TripCard({ trip, cities, isShared, href }: Props) {
  const t = useTranslations('trips.card')
  const tHome = useTranslations('trips.home')

  const card = (
    <div>
      <div className="washed relative h-[210px] w-full overflow-hidden rounded-[28px]">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt={t('cover_alt', { title: trip.title })}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        ) : (
          <TripCardCoverFallback title={trip.title} />
        )}
      </div>
      <div className="mt-3.5 flex items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl">{trip.title}</h3>
        <Badge variant={isShared ? 'shared' : 'private'} className="font-mono uppercase">
          {isShared ? tHome('shared_tag') : tHome('private_tag')}
        </Badge>
      </div>
      <div className="mt-1.5 font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
        {formatDateRange(trip.startDate, trip.endDate)}
      </div>
      {cities.length > 0 && (
        <p className="mt-1 truncate text-[13.5px] text-muted-foreground">{cities.join(', ')}</p>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    )
  }

  return card
}
