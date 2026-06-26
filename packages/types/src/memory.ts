import { z } from 'zod'

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export type Coordinates = z.infer<typeof CoordinatesSchema>

export const MemorySchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  userId: z.string().uuid(),
  note: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional(),
  location: CoordinatesSchema.optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  capturedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Memory = z.infer<typeof MemorySchema>

export const CreateMemorySchema = MemorySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateMemory = z.infer<typeof CreateMemorySchema>

export const UpdateMemorySchema = CreateMemorySchema.partial()
export type UpdateMemory = z.infer<typeof UpdateMemorySchema>
