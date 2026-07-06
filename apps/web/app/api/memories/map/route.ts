import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, memories, memoryMedia } from '@passe/db'
import { createLogger } from '@passe/logger'
import { MapPointSchema } from '@passe/types/memory'
import { and, asc, eq, isNotNull } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/memories/map' } })

// GET /api/memories/map — lean, geotagged-only projection for the /map view.
// Deliberately separate from GET /api/memories (used by dashboard stats),
// which returns full memory rows including every photo.
export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const rows = await db.query.memories.findMany({
    where: and(eq(memories.userId, userId), isNotNull(memories.lat), isNotNull(memories.lng)),
    columns: {
      id: true,
      tripId: true,
      lat: true,
      lng: true,
      city: true,
      country: true,
      note: true,
    },
    with: {
      media: { limit: 1, orderBy: asc(memoryMedia.sortOrder), columns: { url: true } },
    },
  })

  const points = rows.map(({ media, ...rest }) => ({
    ...rest,
    thumbnailUrl: media[0]?.url ?? null,
  }))

  const parsed = MapPointSchema.array().safeParse(points)
  if (!parsed.success) {
    log.error('DB output failed schema validation', { issues: parsed.error.issues })
    return apiError('Invalid map data', 500)
  }

  return apiSuccess(parsed.data)
}
