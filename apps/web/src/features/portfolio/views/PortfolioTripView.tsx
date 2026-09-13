import { EditorialChapters } from '@/features/trips/components/editorial/EditorialChapters'
import { publicPortfolioRoute } from '@/lib/routes'
import { resolveMemoryMedia, resolveTripMedia } from '@/lib/media/media'
import { db } from '@passe/db/client'
import { memories, memoryMedia, trips, users } from '@passe/db/schema'
import { buildEditorialChapters, getUniqueCities } from '@passe/utils'
import { and, asc, count, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { NoPublicMemoriesEmpty } from '../components/NoPublicMemoriesEmpty'
import { PortfolioFooter } from '../components/PortfolioFooter'
import { PortfolioTripHeader } from '../components/PortfolioTripHeader'

interface Props {
  slug: string
  tripId: string
}

export async function PortfolioTripView({ slug, tripId }: Props) {
  const [user] = await db.select().from(users).where(eq(users.username, slug)).limit(1)
  if (!user) notFound()

  const [tripRow] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, user.id), eq(trips.isPublic, true)))
    .limit(1)
  if (!tripRow) notFound()
  const trip = resolveTripMedia(tripRow)

  const [publicMemories, memoriesCountRows] = await Promise.all([
    db.query.memories
      .findMany({
        where: and(eq(memories.tripId, tripId), eq(memories.isPublic, true)),
        with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
      })
      .then((rows) => rows.map(resolveMemoryMedia)),
    db.select({ totalMemoriesCount: count() }).from(memories).where(eq(memories.tripId, tripId)),
  ])
  const totalMemoriesCount = memoriesCountRows[0]?.totalMemoriesCount ?? 0

  const chapters = buildEditorialChapters(publicMemories)
  const { uniqueCities } = getUniqueCities({ allMemories: publicMemories })
  const daysCount = Math.round(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-background">
      <PortfolioTripHeader
        user={user}
        trip={trip}
        cities={[...uniqueCities]}
        daysCount={daysCount}
        sharedMemoriesCount={publicMemories.length}
        totalMemoriesCount={totalMemoriesCount}
      />
      <main className="mx-auto max-w-4xl px-6 py-10">
        {publicMemories.length === 0 ? (
          <NoPublicMemoriesEmpty />
        ) : (
          <EditorialChapters
            chapters={chapters}
            photoAlt="Memory photo"
            scrollLeftLabel="Scroll left"
            scrollRightLabel="Scroll right"
          />
        )}
      </main>
      {publicMemories.length > 0 && (
        <div className="px-6 pt-16 pb-24 text-center">
          <p className="font-display text-[30px]">Kept by {user.displayName} on Passe.</p>
          <a
            href={publicPortfolioRoute(slug)}
            className="mt-4 inline-flex h-[46px] items-center rounded-full border px-6 text-sm hover:bg-secondary"
          >
            See {user.displayName}&apos;s other trips
          </a>
        </div>
      )}
      <PortfolioFooter />
    </div>
  )
}
