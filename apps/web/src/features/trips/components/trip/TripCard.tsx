'use client'

import { Link } from '@/i18n/navigation'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@passe/ui/card'
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
}

interface Props {
  trip: TripCardData
  href?: string
}

export function TripCard({ trip, href }: Props) {
  const t = useTranslations('trips.card')
  const resolvedCoverImageUrl =
    trip.coverImageUrl ??
    'https://images.unsplash.com/photo-1656066848895-30feffe87ed6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpcCUyMHBsYWNlaG9sZGVyfGVufDB8fDB8fHwy'

  return (
    <Card className="pt-0 bg-popover ring-0 shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={resolvedCoverImageUrl}
          alt={t('cover_alt', { title: trip.title })}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="eager"
        />
      </div>

      <CardHeader className="py-4">
        <CardTitle>{trip.title}</CardTitle>
        <CardDescription>{formatDateRange(trip.startDate, trip.endDate)}</CardDescription>
      </CardHeader>
      {trip.countries.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {trip.countries.map((country) => (
              <Badge key={country} variant="outline">
                {country}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
      {href && (
        <CardFooter>
          <Link href={href} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            {t('view')}
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
