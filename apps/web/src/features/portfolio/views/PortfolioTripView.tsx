import { EditorialChapters } from '@/features/trips/components/editorial/EditorialChapters'
import { resolveMemoryMedia, resolveTripMedia } from '@/lib/media/media'
import { canUseThemes } from '@passe/auth/plan-gates'
import { db } from '@passe/db/client'
import { memories, memoryMedia, trips, users } from '@passe/db/schema'
import { buildEditorialChapters } from '@passe/utils'
import { and, asc, eq } from 'drizzle-orm'
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

  const publicMemories = (
    await db.query.memories.findMany({
      where: and(eq(memories.tripId, tripId), eq(memories.isPublic, true)),
      with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
    })
  ).map(resolveMemoryMedia)

  const chapters = buildEditorialChapters(publicMemories)

  const isScrapbook = user.theme === 'scrapbook' && canUseThemes(user.plan)

  return (
    <div className="min-h-screen bg-background" data-theme={isScrapbook ? 'scrapbook' : undefined}>
      <PortfolioTripHeader slug={slug} user={user} trip={trip} />
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
      <PortfolioFooter />
    </div>
  )
}
