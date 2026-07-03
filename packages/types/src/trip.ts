import { z } from 'zod'

export const TripSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().min(1).max(100),
  // Nullable in the DB (text columns without NOT NULL) — Drizzle returns `null`
  // for unset values, so accept null as well as undefined. `.nullish()` keeps
  // these optional on the create side while letting DB rows round-trip.
  description: z.string().max(500).nullish(),
  coverImageUrl: z.string().url().nullish(),
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

// Same shape as CreateTripSchema, plus the cross-field rule that a trip cannot
// end before it starts. Used by the create forms (web + mobile) and the API so
// all three enforce the same constraint. The `path` puts the error on endDate.
export const CreateTripFormSchema = CreateTripSchema.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  },
)

export const UpdateTripSchema = CreateTripSchema.partial()
export type UpdateTrip = z.infer<typeof UpdateTripSchema>

// Trip with its memory count — used in dashboard and portfolio
export const TripWithStatsSchema = TripSchema.extend({
  memoryCount: z.number().int().nonnegative(),
  citiesCount: z.number().int().nonnegative(),
})

export type TripWithStats = z.infer<typeof TripWithStatsSchema>
