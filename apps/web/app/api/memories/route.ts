import { apiError, apiSuccess, requireAuth } from '@/lib/api/api'
import { fromDbMemory } from '@/lib/memory/memory'
import { db, memories, memoryMedia } from '@passe/db'
import { createLogger } from '@passe/logger'
import { MemorySchema } from '@passe/types/memory'
import { asc, desc, eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/memories' } })

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const userMemories = await db.query.memories.findMany({
    where: eq(memories.userId, userId),
    orderBy: desc(memories.capturedAt),
    with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
  })

  const parsed = MemorySchema.array().safeParse(userMemories.map(fromDbMemory))
  if (!parsed.success) {
    log.error('DB output failed schema validation', { issues: parsed.error.issues })
    return apiError('Invalid memory data', 500)
  }

  return apiSuccess(parsed.data)
}
