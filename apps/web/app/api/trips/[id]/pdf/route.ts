import { apiError, requireAuth } from '@/lib/api/api'
import { generateTripPdf } from '@/lib/pdf/generateTripPdf'
import { canExportPdf } from '@passe/auth/plan-gates'
import { db, memories, memoryMedia, trips, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { buildEditorialChapters } from '@passe/utils'
import { and, asc, eq } from 'drizzle-orm'

// sharp (image resizing) and @react-pdf/renderer's font loader read local
// files — both incompatible with the Edge runtime, same constraint as
// /api/media/[...key].
export const runtime = 'nodejs'

const log = createLogger({ context: { module: 'api/trips/id/pdf' } })

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'trip'
}

// GET /api/trips/[id]/pdf — Collector-only PDF Memory Book export.
export async function GET(_req: Request, ctx: RouteContext<'/api/trips/[id]/pdf'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = await ctx.params

  const trip = await db.query.trips.findFirst({
    where: and(eq(trips.id, id), eq(trips.userId, userId)),
  })
  if (!trip) return apiError('Trip not found', 404)

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return apiError('User not found', 404)

  if (!canExportPdf(user.plan)) {
    return apiError('Upgrade to Collector to export PDF', 403)
  }

  const tripMemories = await db.query.memories.findMany({
    where: eq(memories.tripId, id),
    with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
  })

  const chapters = buildEditorialChapters(tripMemories)

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generateTripPdf(trip, chapters)
  } catch (err) {
    log.error('PDF generation failed', {
      tripId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Failed to generate PDF', 500)
  }

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slugifyTitle(trip.title)}.pdf"`,
    },
  })
}
