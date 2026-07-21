'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { Badge } from '@passe/ui/badge'
import {
  MediaCard,
  MediaCardDescription,
  MediaCardMedia,
  MediaCardScrim,
  MediaCardTitle,
} from '@passe/ui/media-card'
import { formatDateRange } from '@passe/utils'
import Image from 'next/image'

interface TripData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
  coverImagePlaceholder?: string | null
  coverImageSrcset?: Record<string, string> | null
}

interface Props {
  trip: TripData
  href?: string
  tilt?: 'none' | 'left' | 'right'
}

export function PortfolioTripCard({ trip, href, tilt = 'none' }: Props) {
  const card = (
    <MediaCard
      tilt={tilt}
      className={
        trip.coverImageUrl
          ? undefined
          : 'bg-gradient-to-br from-sandy-beige via-sandy-beige-dark to-terracotta/40'
      }
    >
      {trip.coverImageUrl && (
        <MediaCardMedia>
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        </MediaCardMedia>
      )}
      <MediaCardScrim>
        <MediaCardTitle>{trip.title}</MediaCardTitle>
        <MediaCardDescription>{formatDateRange(trip.startDate, trip.endDate)}</MediaCardDescription>
        {trip.countries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {trip.countries.map((country) => (
              <Badge key={country} variant="stamp" className="text-aged-cream">
                {country}
              </Badge>
            ))}
          </div>
        )}
      </MediaCardScrim>
    </MediaCard>
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
