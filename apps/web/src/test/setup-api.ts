import { vi } from 'vitest'

// requireAuth() (src/lib/api.ts) calls ensureUserExists() as a Clerk-webhook backfill safety
// net (see src/lib/ensure-user.ts) — it hits the real `users` table before any route handler
// runs. Route tests exercise business logic assuming the user row already exists and mock
// `@passe/db` per-file for that purpose only; mocking this out globally here avoids every
// route test needing its own `db.query.users.findFirst` stub just to satisfy this side effect.
vi.mock('@/lib/api/ensure-user', () => ({
  ensureUserExists: vi.fn().mockResolvedValue(undefined),
}))
