import { apiError, requireAuth } from '@/lib/api/api'
import { generatePostcard } from '@/lib/pdf/postcard/generatePostcard'
import { canExportPdf } from '@passe/auth/plan-gates'
import { db, memories, memoryMedia, trips, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { PostcardSelectionSchema } from '@passe/types/memory'
import { and, asc, eq } from 'drizzle-orm'

// sharp (image resizing) and @react-pdf/renderer's font loader read local
// files — both incompatible with the Edge runtime, same constraint as
// /api/trips/[id]/pdf and /api/trips/[id]/zine.
export const runtime = 'nodejs'

const log = createLogger({ context: { module: 'api/trips/id/postcard' } })

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'trip'
}

// POST /api/trips/[id]/postcard — Collector-only single-photo postcard
// export. Body: { memoryId: string, message?: string } (see
// PostcardSelectionSchema).
export async function POST(req: Request, ctx: RouteContext<'/api/trips/[id]/postcard'>) {
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
    return apiError('Upgrade to Collector to export a postcard', 403)
  }

  const body = await req.json()
  const parsed = PostcardSelectionSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  const memory = await db.query.memories.findFirst({
    where: and(eq(memories.tripId, id), eq(memories.id, parsed.data.memoryId)),
    with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
  })

  if (!memory) return apiError('Memory not found on this trip', 400)
  if (memory.media.length === 0) return apiError('Memory has no photo', 400)

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generatePostcard(memory, parsed.data.message)
  } catch (err) {
    log.error('Postcard generation failed', {
      tripId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Failed to generate postcard', 500)
  }

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slugifyTitle(trip.title)}-postcard.pdf"`,
    },
  })
}
