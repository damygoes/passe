import { z } from 'zod'

export const TripSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  coverImageUrl: z.string().url().optional(),
  countries: z.array(z.string()).min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isPublic: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Trip = z.infer<typeof TripSchema>

export const CreateTripSchema = TripSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateTrip = z.infer<typeof CreateTripSchema>

export const UpdateTripSchema = CreateTripSchema.partial()
export type UpdateTrip = z.infer<typeof UpdateTripSchema>

// Trip with its memory count — used in dashboard and portfolio
export const TripWithStatsSchema = TripSchema.extend({
  memoryCount: z.number().int().nonnegative(),
  citiesCount: z.number().int().nonnegative(),
})

export type TripWithStats = z.infer<typeof TripWithStatsSchema>
