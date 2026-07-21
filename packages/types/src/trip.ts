import { z } from 'zod'

export const TripSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string().min(1).max(100),
  // Nullable in the DB (text columns without NOT NULL) — Drizzle returns `null`
  // for unset values, so accept null as well as undefined. `.nullish()` keeps
  // these optional on the create side while letting DB rows round-trip.
  description: z.string().max(500).nullish(),
  // Not `.url()`: a fresh upload is submitted as a bare S3 object key
  // (e.g. "passe/<userId>/<uuid>.jpg"), not a URL — it's only resolved into
  // a signed, absolute delivery URL at read time (see apps/web/src/lib/media.ts).
  // Legacy rows may still hold a full Cloudinary URL, which this also accepts.
  coverImageUrl: z.string().min(1).nullish(),
  // Server-generated blur-up placeholder (tiny base64 JPEG data URI) and a
  // set of pre-signed URLs keyed by width bucket for responsive rendering.
  // Both are read-only/derived — never accepted from clients, see
  // CreateTripSchema's omit list below.
  coverImagePlaceholder: z.string().nullish(),
  coverImageSrcset: z.record(z.string(), z.string()).nullish(),
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
  coverImagePlaceholder: true,
  coverImageSrcset: true,
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
