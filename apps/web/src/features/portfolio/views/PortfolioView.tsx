import { resolveTripMedia } from '@/lib/media/media'
import { db } from '@passe/db/client'
import { memories, trips, users } from '@passe/db/schema'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { and, desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { PortfolioFooter } from '../components/PortfolioFooter'
import { PortfolioGrid } from '../components/PortfolioGrid'
import { PortfolioHeader } from '../components/PortfolioHeader'
import { PortfolioSidebar } from '../components/PortfolioSidebar'

interface Props {
  slug: string
}

export async function PortfolioView({ slug }: Props) {
  const [user] = await db.select().from(users).where(eq(users.username, slug)).limit(1)

  if (!user) notFound()

  const publicTrips = (
    await db
      .select()
      .from(trips)
      .where(and(eq(trips.userId, user.id), eq(trips.isPublic, true)))
      .orderBy(desc(trips.startDate))
  ).map(resolveTripMedia)

  const publicMemories = await db.query.memories.findMany({
    where: and(eq(memories.userId, user.id), eq(memories.isPublic, true)),
  })

  const { uniqueCountries } = getUniqueStatsFromTrips({ trips: publicTrips })
  const { uniqueCities } = getUniqueCities({ allMemories: publicMemories })

  return (
    <div className="min-h-screen bg-background">
      <PortfolioHeader username={user.username} />
      <main className="mx-auto max-w-[1280px] px-6 pt-[70px] pb-20 sm:px-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[300px_1fr]">
          <PortfolioSidebar
            user={user}
            memberSinceYear={new Date(user.createdAt).getFullYear()}
            tripCount={publicTrips.length}
            countriesCount={uniqueCountries.size}
            citiesCount={uniqueCities.size}
          />
          <div>
            <h2 className="font-display text-[60px] leading-[1.02] tracking-[-0.02em]">
              {publicTrips.length} {publicTrips.length === 1 ? 'trip,' : 'trips,'}
              <br />
              chosen carefully.
            </h2>
            <div className="mt-9">
              <PortfolioGrid slug={slug} displayName={user.displayName} trips={publicTrips} />
            </div>
          </div>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  )
}
