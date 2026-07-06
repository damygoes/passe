import { Badge } from '@passe/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@passe/ui/card'
import { formatDateRange } from '@passe/utils'
import Image from 'next/image'

interface TripData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
}

interface Props {
  trip: TripData
  href?: string
}

export function PortfolioTripCard({ trip, href }: Props) {
  const card = (
    <Card className={href ? 'transition-shadow duration-200 hover:shadow-md' : undefined}>
      {trip.coverImageUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
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
    </Card>
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
