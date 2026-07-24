'use client'

import { TripPolaroidCard } from '@/components/shared/TripPolaroidCard'
import { TripCardCoverFallback } from '@/features/trips/components/trip/card/TripCardCoverFallback'
import { Link } from '@/i18n/navigation'
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
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface TripCardData {
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
  trip: TripCardData
  href?: string
  tilt?: 'none' | 'left' | 'right'
}

export function TripCard({ trip, href, tilt = 'none' }: Props) {
  const t = useTranslations('trips.card')

  const card = (
    <>
      {/* Editorial rendering — hidden entirely under scrapbook rather than
          left underneath, so no dead image fetch/paint competes with it. */}
      <div className="scrapbook:hidden">
        <MediaCard tilt={tilt}>
          <MediaCardMedia>
            {trip.coverImageUrl ? (
              <Image
                src={trip.coverImageUrl}
                alt={t('cover_alt', { title: trip.title })}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                {...getBlurProps(trip.coverImagePlaceholder)}
                {...(trip.coverImageSrcset
                  ? { loader: createMediaLoader(trip.coverImageSrcset) }
                  : {})}
              />
            ) : (
              <TripCardCoverFallback title={trip.title} />
            )}
          </MediaCardMedia>
          <MediaCardScrim>
            <MediaCardTitle>{trip.title}</MediaCardTitle>
            <MediaCardDescription>
              {formatDateRange(trip.startDate, trip.endDate)}
            </MediaCardDescription>
            {trip.countries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {trip.countries.map((country) => (
                  <Badge
                    key={country}
                    variant="stamp"
                    className="text-aged-cream px-2 py-3 rounded-lg"
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            )}
          </MediaCardScrim>
        </MediaCard>
      </div>
      {/* Scrapbook theme's own card style — a tilted, taped polaroid instead
          of the full-bleed editorial tile. */}
      <div className="hidden scrapbook:block">
        <TripPolaroidCard trip={trip} />
      </div>
    </>
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
