import { routes, publicPortfolioRoute } from '@/lib/routes'
import { db } from '@passe/db/client'
import { memories, trips, users } from '@passe/db/schema'
import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { NoPublicMemoriesEmpty } from '../components/NoPublicMemoriesEmpty'
import { PublicMemoryCard } from '../components/PublicMemoryCard'

interface Props {
  slug: string
  tripId: string
}

export async function PortfolioTripView({ slug, tripId }: Props) {
  const [user] = await db.select().from(users).where(eq(users.username, slug)).limit(1)
  if (!user) notFound()

  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, user.id), eq(trips.isPublic, true)))
    .limit(1)
  if (!trip) notFound()

  const publicMemories = await db
    .select()
    .from(memories)
    .where(and(eq(memories.tripId, tripId), eq(memories.isPublic, true)))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <a
            href={publicPortfolioRoute(slug)}
            className="mb-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            ← {user.displayName}&apos;s portfolio
          </a>
          <h1 className="font-heading text-3xl font-semibold">{trip.title}</h1>
          {trip.description && <p className="mt-2 text-muted-foreground">{trip.description}</p>}
          {trip.countries.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">{trip.countries.join(' · ')}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {publicMemories.length === 0 ? (
          <NoPublicMemoriesEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {publicMemories.map((memory) => (
              <PublicMemoryCard key={memory.id} memory={memory} />
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
