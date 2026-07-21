import { apiError, requireAuth } from '@/lib/api'
import { generateTripZine } from '@/lib/pdf/zine/generateTripZine'
import { canExportPdf } from '@passe/auth/plan-gates'
import { db, memories, memoryMedia, trips, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { ZineSelectionSchema } from '@passe/types/memory'
import { and, asc, eq, inArray } from 'drizzle-orm'

// sharp (image resizing) and @react-pdf/renderer's font loader read local
// files — both incompatible with the Edge runtime, same constraint as
// /api/trips/[id]/pdf.
export const runtime = 'nodejs'

const log = createLogger({ context: { module: 'api/trips/id/zine' } })

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'trip'
}

// POST /api/trips/[id]/zine — Collector-only single-sheet zine export.
// Body: { memoryIds: string[] } — exactly 6 memories, in the order they
// should read (see ZineSelectionSchema).
export async function POST(req: Request, ctx: RouteContext<'/api/trips/[id]/zine'>) {
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
    return apiError('Upgrade to Collector to export a zine', 403)
  }

  const body = await req.json()
  const parsed = ZineSelectionSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  const selected = await db.query.memories.findMany({
    where: and(eq(memories.tripId, id), inArray(memories.id, parsed.data.memoryIds)),
    with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
  })

  if (selected.length !== parsed.data.memoryIds.length) {
    return apiError('One or more memories do not belong to this trip', 400)
  }

  // Preserve the picker's chosen reading order — the DB result order isn't
  // guaranteed to match parsed.data.memoryIds.
  const byId = new Map(selected.map((memory) => [memory.id, memory]))
  const orderedMemories = parsed.data.memoryIds.map((memoryId) => byId.get(memoryId)!)

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generateTripZine(trip, orderedMemories)
  } catch (err) {
    log.error('Zine generation failed', {
      tripId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Failed to generate zine', 500)
  }

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slugifyTitle(trip.title)}-zine.pdf"`,
    },
  })
}
