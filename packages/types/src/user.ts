import { z } from 'zod'

export const PlanSchema = z.enum(['free', 'explorer', 'collector'])
export type Plan = z.infer<typeof PlanSchema>

// Mirrors the Postgres user_theme enum exactly — no mapping layer needed
export const UserThemeSchema = z.enum(['editorial', 'scrapbook'])
export type UserTheme = z.infer<typeof UserThemeSchema>

// DB representation — mirrors what the database actually stores; no UI-level constraints
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  displayName: z.string(),
  bio: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  plan: PlanSchema.default('free'),
  theme: UserThemeSchema.default('editorial'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof UserSchema>

// What's returned on public portfolio pages — no sensitive fields
export const PublicUserSchema = UserSchema.pick({
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  // Drives the public portfolio's visual theme — not sensitive
  theme: true,
})
export type PublicUser = z.infer<typeof PublicUserSchema>

// What the authenticated user sees about themselves — the public fields plus
// plan, which drives client-side plan gating. Never exposed on public pages.
export const AuthUserSchema = PublicUserSchema.extend({
  plan: PlanSchema,
})
export type AuthUser = z.infer<typeof AuthUserSchema>

// User input validation for profile form — separate from the DB schema so
// length constraints only apply to what users can submit, not to what the DB stores
export const UpdateUserSchema = z
  .object({
    displayName: z.string().min(1).max(50),
    username: z.string().min(3).max(30),
    bio: z.string().max(160).nullish(),
    theme: UserThemeSchema,
  })
  .partial()
export type UpdateUser = z.infer<typeof UpdateUserSchema>
