import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, memories } from '@passe/db'
import { createLogger } from '@passe/logger'
import { MemorySchema } from '@passe/types/memory'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/memories' } })

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const userMemories = await db.query.memories.findMany({
    where: eq(memories.userId, userId),
  })

  const parsed = MemorySchema.array().safeParse(userMemories)
  if (!parsed.success) {
    log.error('DB output failed schema validation', { issues: parsed.error.issues })
    return apiError('Invalid memory data', 500)
  }

  return apiSuccess(parsed.data)
}
