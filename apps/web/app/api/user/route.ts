import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { PublicUserSchema, UpdateUserSchema } from '@passe/types/user'
import { eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/user' } })

// GET /api/user — fetch the current authenticated user
export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) return apiError('User not found', 404)

  const parsed = PublicUserSchema.safeParse(user)
  if (!parsed.success) {
    log.error('DB output failed schema validation', { userId, issues: parsed.error.issues })
    return apiError('Invalid user data', 500)
  }

  return apiSuccess(parsed.data)
}

// PATCH /api/user — update profile fields
export async function PATCH(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const parsed = UpdateUserSchema.safeParse(body)

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  // Check username is not already taken by another user
  if (parsed.data.username) {
    const existing = await db.query.users.findFirst({
      where: eq(users.username, parsed.data.username),
    })
    if (existing && existing.id !== userId) {
      return apiError('Username already taken', 409)
    }
  }

  let updated
  try {
    ;[updated] = await db
      .update(users)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  const validatedResponse = PublicUserSchema.safeParse(updated)
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      userId,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  return apiSuccess(validatedResponse.data)
}
