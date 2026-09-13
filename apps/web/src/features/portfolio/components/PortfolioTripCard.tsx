'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { formatDateRange } from '@passe/utils'
import Image from 'next/image'
import { TripCardCoverFallback } from '@/features/trips/components/trip/card/TripCardCoverFallback'

interface TripData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  coverImageUrl?: string | null
  coverImagePlaceholder?: string | null
  coverImageSrcset?: Record<string, string> | null
}

interface Props {
  trip: TripData
  href?: string
}

export function PortfolioTripCard({ trip, href }: Props) {
  const card = (
    <div>
      <div className="washed relative h-[230px] w-full overflow-hidden rounded-[28px]">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        ) : (
          <TripCardCoverFallback title={trip.title} />
        )}
      </div>
      <h3 className="font-display mt-3.5 text-[27px] leading-tight">{trip.title}</h3>
      <p className="mt-1 font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
        {formatDateRange(trip.startDate, trip.endDate)}
      </p>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {card}
      </a>
    )
  }

  return card
}
