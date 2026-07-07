import { auth } from '@clerk/nextjs/server'
import { ensureUserExists } from './ensure-user'

// Consistent error response shape
export function apiError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

// Consistent success response shape
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ data }, { status })
}

// Auth guard — call at the top of every protected route handler
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    return { userId: null, error: apiError('Unauthorised', 401) }
  }
  await ensureUserExists(userId)
  return { userId, error: null }
}
