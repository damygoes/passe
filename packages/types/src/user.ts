import { z } from 'zod'

export const PlanSchema = z.enum(['free', 'explorer', 'collector'])
export type Plan = z.infer<typeof PlanSchema>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(50),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url().optional(),
  plan: PlanSchema.default('free'),
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
})

export type PublicUser = z.infer<typeof PublicUserSchema>

// Form schema for updating profile settings
export const UpdateUserSchema = UserSchema.pick({
  displayName: true,
  bio: true,
  username: true,
}).partial()

export type UpdateUser = z.infer<typeof UpdateUserSchema>
