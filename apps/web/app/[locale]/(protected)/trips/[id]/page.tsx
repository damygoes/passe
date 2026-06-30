import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { and, asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@passe/db/client'
import { memories, trips } from '@passe/db/schema'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardHeader, CardDescription } from '@passe/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderDescription,
} from '@passe/ui/page-header'

interface Props {
  params: Promise<{ locale: string; id: string }>
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default async function TripDetailPage({ params }: Props) {
  const { locale, id } = await params
  const { userId } = await auth()

  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, id), eq(trips.userId, userId!)))
    .limit(1)

  if (!trip) {
    notFound()
  }

  const tripMemories = await db
    .select()
    .from(memories)
    .where(eq(memories.tripId, id))
    .orderBy(asc(memories.capturedAt))

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader>
        <PageHeaderTitle>{trip.title}</PageHeaderTitle>
        <PageHeaderDescription>
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </PageHeaderDescription>
        <PageHeaderAction>
          <Link
            href={`/${locale}/dashboard`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            ← Back
          </Link>
        </PageHeaderAction>
      </PageHeader>

      {/* Countries */}
      {trip.countries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </div>
      )}

      {/* Cover image */}
      {trip.coverImageUrl && (
        <div className="mt-6 overflow-hidden rounded-xl">
          <img
            src={trip.coverImageUrl}
            alt={`Cover photo for ${trip.title}`}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      {/* Description */}
      {trip.description && (
        <p className="mt-4 text-muted-foreground">{trip.description}</p>
      )}

      {/* Memory feed */}
      <div className="mt-8">
        <h2 className="font-heading mb-4 text-lg font-semibold">
          Memories
          {tripMemories.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {tripMemories.length}
            </span>
          )}
        </h2>

        {tripMemories.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No memories yet</EmptyTitle>
              <EmptyDescription>
                Add photos, notes, and GPS-tagged moments from this trip.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <button className={buttonVariants({ size: 'sm' })}>Add first memory</button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {tripMemories.map((memory) => (
              <Card key={memory.id}>
                {memory.photoUrl && (
                  <img src={memory.photoUrl} alt="Memory photo" />
                )}
                <CardHeader>
                  {(memory.city || memory.country) && (
                    <CardDescription>
                      {[memory.city, memory.country].filter(Boolean).join(', ')}
                    </CardDescription>
                  )}
                </CardHeader>
                {memory.note && (
                  <CardContent>
                    <p className="text-sm">{memory.note}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
