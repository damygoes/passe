'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
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

  return (
    <Card>
      {trip.coverImageUrl && (
        <img src={trip.coverImageUrl} alt={t('cover_alt', { title: trip.title })} />
      )}
      <CardHeader>
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
