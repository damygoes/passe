import { TripCard } from '@/features/trips/components/trip/TripCard'
import { routes } from '@/lib/routes'
import { db } from '@passe/db/client'
import { trips, users } from '@passe/db/schema'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import { and, desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params

  const [user] = await db.select().from(users).where(eq(users.username, slug)).limit(1)

  if (!user) {
    notFound()
  }

  const publicTrips = await db
    .select()
    .from(trips)
    .where(and(eq(trips.userId, user.id), eq(trips.isPublic, true)))
    .orderBy(desc(trips.startDate))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Portfolio</p>
          <h1 className="font-heading text-3xl font-semibold">{user.displayName}</h1>
          {user.bio && <p className="mt-2 text-muted-foreground">{user.bio}</p>}
          <p className="mt-3 text-sm text-muted-foreground">
            {publicTrips.length} public {publicTrips.length === 1 ? 'trip' : 'trips'}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {publicTrips.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>Nothing to see here yet</EmptyTitle>
              <EmptyDescription>
                {user.displayName} hasn&apos;t shared any public trips yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {publicTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t px-6 py-6 text-center text-xs text-muted-foreground">
        Powered by{' '}
        <a href={routes.home} className="underline underline-offset-4 hover:text-foreground">
          Passé.
        </a>
      </footer>
    </div>
  )
}
