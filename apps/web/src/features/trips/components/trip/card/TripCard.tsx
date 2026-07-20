'use client'

import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/image-blur'
import { createMediaLoader } from '@/lib/media-image-loader'
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
  const resolvedCoverImageUrl =
    trip.coverImageUrl ??
    'https://images.unsplash.com/photo-1656066848895-30feffe87ed6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpcCUyMHBsYWNlaG9sZGVyfGVufDB8fDB8fHwy'
  // Blur placeholder + bucketed loader only apply to the user's own cover
  // image — never to the hardcoded Unsplash fallback used when there isn't one.
  const hasOwnCover = Boolean(trip.coverImageUrl)

  const card = (
    <MediaCard tilt={tilt}>
      <MediaCardMedia>
        <Image
          src={resolvedCoverImageUrl}
          alt={t('cover_alt', { title: trip.title })}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
          {...(hasOwnCover ? getBlurProps(trip.coverImagePlaceholder) : {})}
          {...(hasOwnCover && trip.coverImageSrcset
            ? { loader: createMediaLoader(trip.coverImageSrcset) }
            : {})}
        />
      </MediaCardMedia>
      <MediaCardScrim>
        <MediaCardTitle>{trip.title}</MediaCardTitle>
        <MediaCardDescription>{formatDateRange(trip.startDate, trip.endDate)}</MediaCardDescription>
        {trip.countries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {trip.countries.map((country) => (
              <Badge key={country} variant="stamp" className="text-aged-cream px-2 py-3 rounded-lg">
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
      <Link href={href} className="block">
        {card}
      </Link>
    )
  }

  return card
}
