import { resolveTripMedia } from '@/lib/media'
import { db } from '@passe/db/client'
import { trips, users } from '@passe/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { PortfolioFooter } from '../components/PortfolioFooter'
import { PortfolioGrid } from '../components/PortfolioGrid'
import { PortfolioHeader } from '../components/PortfolioHeader'

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

  return (
    <div className="min-h-screen bg-background">
      <PortfolioHeader user={user} tripCount={publicTrips.length} />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <PortfolioGrid slug={slug} displayName={user.displayName} trips={publicTrips} />
      </main>
      <PortfolioFooter />
    </div>
  )
}
