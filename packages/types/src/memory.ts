import { z } from 'zod'

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export type Coordinates = z.infer<typeof CoordinatesSchema>

export const MediaTypeSchema = z.enum(['photo', 'video'])
export type MediaType = z.infer<typeof MediaTypeSchema>

// Editorial layout of a memory on the trip page. 'auto' lets the layout
// engine decide; other values are explicit user overrides. Literals match
// the Postgres enum exactly so no mapping layer is needed.
export const LayoutVariantSchema = z.enum([
  'auto',
  'hero',
  'image_left',
  'image_right',
  'carousel',
  'text',
])
export type LayoutVariant = z.infer<typeof LayoutVariantSchema>

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
  // Server-generated blur-up placeholder and width-bucketed pre-signed URL
  // set — read-only/derived, never accepted from clients (not present on
  // CreateMemoryMediaSchema below).
  placeholder: z.string().nullish(),
  srcset: z.record(z.string(), z.string()).nullish(),
  createdAt: z.coerce.date(),
})

export type MemoryMedia = z.infer<typeof MemoryMediaSchema>

// Media item as supplied by clients when creating/updating a memory —
// ids and ordering are assigned server-side (array position = sortOrder).
// `url` is not `.url()`-validated: a fresh upload submits a bare S3 object
// key, only resolved into a signed absolute URL at read time (see
// apps/web/src/lib/media.ts). MemoryMediaSchema.url below stays a strict
// `.url()` since it's the read/output shape, always post-resolution.
export const CreateMemoryMediaSchema = z.object({
  url: z.string().min(1),
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
  layoutVariant: LayoutVariantSchema.default('auto'),
  // Explicit position on the editorial page; null = chronological (auto)
  sortOrder: z.number().int().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Memory = z.infer<typeof MemorySchema>

// Lean shape for the /map view — only what's needed to plot a pin. Lat/lng
// are flattened (never null; the API only returns geotagged memories) and
// media collapses to a single thumbnail instead of the full gallery.
export const MapPointSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  lat: z.number(),
  lng: z.number(),
  city: z.string().nullish(),
  country: z.string().nullish(),
  note: z.string().nullish(),
  thumbnailUrl: z.string().url().nullish(),
  thumbnailPlaceholder: z.string().nullish(),
})

export type MapPoint = z.infer<typeof MapPointSchema>

// Body of PATCH /api/trips/[id]/memories/reorder — every memory of the trip
// in its new display order.
export const ReorderMemoriesSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
})
export type ReorderMemories = z.infer<typeof ReorderMemoriesSchema>

// Body of POST /api/trips/[id]/zine — the memories chosen for the zine's
// (up to) 6 content panels, in the order they'll read. The classic
// single-sheet zine fold hard-caps at 6 content panels; fewer than 6 is
// allowed (remaining panels fall back to a placeholder design), more is not.
export const ZineSelectionSchema = z.object({
  memoryIds: z.array(z.string().uuid()).min(1).max(6),
})
export type ZineSelection = z.infer<typeof ZineSelectionSchema>

export const CreateMemorySchema = MemorySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  media: true,
}).extend({
  media: CreateMemoryMediaSchema.array().default([]),
})

// Input type (defaults like isPublic/layoutVariant/media stay optional for
// clients); the API validates and works with the parsed output type.
export type CreateMemory = z.input<typeof CreateMemorySchema>

// Create shape plus the cross-field rule that a memory must have some
// content — a note or at least one media item. Used by the forms and the
// API POST handler so both enforce the same constraint.
export const CreateMemoryFormSchema = CreateMemorySchema.refine(
  (data) => Boolean(data.note?.trim()) || data.media.length > 0,
  { message: 'Add a photo or a note', path: ['media'] },
)

export const UpdateMemorySchema = CreateMemorySchema.partial()
export type UpdateMemory = z.infer<typeof UpdateMemorySchema>
