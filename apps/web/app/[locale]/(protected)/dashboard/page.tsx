import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { db } from '@passe/db/client'
import { memories, trips } from '@passe/db/schema'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@passe/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'

interface Props {
  params: Promise<{ locale: string }>
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)} – ${formatDate(end)}`
}

export default async function Dashboard({ params }: Props) {
  const { locale } = await params
  const { userId } = await auth()

  const [userTrips, citiesData] = await Promise.all([
    db.select().from(trips).where(eq(trips.userId, userId!)).orderBy(desc(trips.startDate)),
    db
      .selectDistinct({ city: memories.city })
      .from(memories)
      .where(and(eq(memories.userId, userId!), isNotNull(memories.city))),
  ])

  const uniqueCountries = new Set(userTrips.flatMap((t) => t.countries))
  const uniqueYears = new Set(userTrips.map((t) => new Date(t.startDate).getFullYear()))
  const uniqueCities = new Set(citiesData.map((m) => m.city).filter(Boolean))

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader>
        <PageHeaderTitle>My Trips</PageHeaderTitle>
        {userTrips.length > 0 && (
          <PageHeaderDescription>
            {userTrips.length} {userTrips.length === 1 ? 'trip' : 'trips'} across{' '}
            {uniqueCountries.size} {uniqueCountries.size === 1 ? 'country' : 'countries'}
          </PageHeaderDescription>
        )}
        <PageHeaderAction>
          <Link
            href={`/${locale}/trips/new`}
            className={buttonVariants({ size: 'sm' })}
          >
            New trip
          </Link>
        </PageHeaderAction>
      </PageHeader>

      {/* Stats */}
      {userTrips.length > 0 && (
        <div className="mt-6 flex gap-8 border-y py-4">
          <div>
            <p className="text-2xl font-semibold">{uniqueCountries.size}</p>
            <p className="text-sm text-muted-foreground">
              {uniqueCountries.size === 1 ? 'Country' : 'Countries'}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{uniqueCities.size}</p>
            <p className="text-sm text-muted-foreground">
              {uniqueCities.size === 1 ? 'City' : 'Cities'}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{uniqueYears.size}</p>
            <p className="text-sm text-muted-foreground">
              {uniqueYears.size === 1 ? 'Year' : 'Years'}
            </p>
          </div>
        </div>
      )}

      {/* Trip grid */}
      {userTrips.length === 0 ? (
        <Empty className="mt-16 border">
          <EmptyHeader>
            <EmptyTitle>No trips yet</EmptyTitle>
            <EmptyDescription>
              Start by creating your first trip — add photos, notes, and memories along the way.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href={`/${locale}/trips/new`} className={buttonVariants({ size: 'sm' })}>
              Create your first trip
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userTrips.map((trip) => (
            <Card key={trip.id}>
              {trip.coverImageUrl && (
                <img src={trip.coverImageUrl} alt={`Cover photo for ${trip.title}`} />
              )}
              <CardHeader>
                <CardTitle>{trip.title}</CardTitle>
                <CardDescription>
                  {formatDateRange(trip.startDate, trip.endDate)}
                </CardDescription>
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
              <CardFooter>
                <Link
                  href={`/${locale}/trips/${trip.id}`}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  View trip
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
