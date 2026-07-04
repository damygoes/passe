import { z } from 'zod'

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export type Coordinates = z.infer<typeof CoordinatesSchema>

export const MediaTypeSchema = z.enum(['photo', 'video'])
export type MediaType = z.infer<typeof MediaTypeSchema>

// A single photo/video belonging to a memory. Nullable DB columns use
// .nullish() so Drizzle rows (which return null) round-trip validation.
export const MemoryMediaSchema = z.object({
  id: z.string().uuid(),
  memoryId: z.string().uuid(),
  url: z.string().url(),
  mediaType: MediaTypeSchema,
  sortOrder: z.number().int().nonnegative(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  createdAt: z.coerce.date(),
})

export type MemoryMedia = z.infer<typeof MemoryMediaSchema>

// Media item as supplied by clients when creating/updating a memory —
// ids and ordering are assigned server-side (array position = sortOrder).
export const CreateMemoryMediaSchema = z.object({
  url: z.string().url(),
  mediaType: MediaTypeSchema.default('photo'),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
})

export type CreateMemoryMedia = z.infer<typeof CreateMemoryMediaSchema>

export const MemorySchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  userId: z.string(),
  note: z.string().max(1000).nullish(),
  media: MemoryMediaSchema.array().default([]),
  location: CoordinatesSchema.nullish(),
  city: z.string().max(100).nullish(),
  country: z.string().max(100).nullish(),
  capturedAt: z.coerce.date(),
  isPublic: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Memory = z.infer<typeof MemorySchema>

export const CreateMemorySchema = MemorySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  media: true,
}).extend({
  media: CreateMemoryMediaSchema.array().default([]),
})

export type CreateMemory = z.infer<typeof CreateMemorySchema>

// Create shape plus the cross-field rule that a memory must have some
// content — a note or at least one media item. Used by the forms and the
// API POST handler so both enforce the same constraint.
export const CreateMemoryFormSchema = CreateMemorySchema.refine(
  (data) => Boolean(data.note?.trim()) || data.media.length > 0,
  { message: 'Add a photo or a note', path: ['media'] },
)

export const UpdateMemorySchema = CreateMemorySchema.partial()
export type UpdateMemory = z.infer<typeof UpdateMemorySchema>
