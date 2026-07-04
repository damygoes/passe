import { describe, it, expect } from 'vitest'
import {
  MemorySchema,
  CoordinatesSchema,
  CreateMemorySchema,
  CreateMemoryFormSchema,
  MemoryMediaSchema,
} from '../memory'

const validMemory = {
  id: '00000000-0000-0000-0000-000000000001',
  tripId: '00000000-0000-0000-0000-000000000002',
  userId: '00000000-0000-0000-0000-000000000003',
  capturedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const validMedia = {
  id: '00000000-0000-0000-0000-000000000004',
  memoryId: '00000000-0000-0000-0000-000000000001',
  url: 'https://example.com/photo.jpg',
  mediaType: 'photo',
  sortOrder: 0,
  createdAt: new Date(),
}

describe('CoordinatesSchema', () => {
  it('accepts valid coordinates', () => {
    expect(CoordinatesSchema.safeParse({ lat: 35.6762, lng: 139.6503 }).success).toBe(true)
    expect(CoordinatesSchema.safeParse({ lat: 0, lng: 0 }).success).toBe(true)
  })

  it('rejects latitude below -90', () => {
    expect(CoordinatesSchema.safeParse({ lat: -91, lng: 0 }).success).toBe(false)
  })

  it('rejects latitude above 90', () => {
    expect(CoordinatesSchema.safeParse({ lat: 91, lng: 0 }).success).toBe(false)
  })

  it('accepts latitude at the exact bounds', () => {
    expect(CoordinatesSchema.safeParse({ lat: -90, lng: 0 }).success).toBe(true)
    expect(CoordinatesSchema.safeParse({ lat: 90, lng: 0 }).success).toBe(true)
  })

  it('rejects longitude below -180', () => {
    expect(CoordinatesSchema.safeParse({ lat: 0, lng: -181 }).success).toBe(false)
  })

  it('rejects longitude above 180', () => {
    expect(CoordinatesSchema.safeParse({ lat: 0, lng: 181 }).success).toBe(false)
  })

  it('accepts longitude at the exact bounds', () => {
    expect(CoordinatesSchema.safeParse({ lat: 0, lng: -180 }).success).toBe(true)
    expect(CoordinatesSchema.safeParse({ lat: 0, lng: 180 }).success).toBe(true)
  })
})

describe('MemorySchema', () => {
  it('accepts a minimal memory with no optional fields', () => {
    expect(MemorySchema.safeParse(validMemory).success).toBe(true)
  })

  it('accepts all optional fields when present', () => {
    const result = MemorySchema.safeParse({
      ...validMemory,
      note: 'Beautiful sunset',
      media: [validMedia],
      location: { lat: 35.6762, lng: 139.6503 },
      city: 'Tokyo',
      country: 'Japan',
    })
    expect(result.success).toBe(true)
  })

  it('defaults media to an empty array when absent', () => {
    const result = MemorySchema.safeParse(validMemory)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.media).toEqual([])
  })

  it('rejects a note exceeding 1000 characters', () => {
    expect(MemorySchema.safeParse({ ...validMemory, note: 'a'.repeat(1001) }).success).toBe(false)
  })

  it('rejects an invalid media url', () => {
    expect(
      MemorySchema.safeParse({ ...validMemory, media: [{ ...validMedia, url: 'not-a-url' }] })
        .success,
    ).toBe(false)
  })

  it('rejects invalid coordinates in location', () => {
    expect(MemorySchema.safeParse({ ...validMemory, location: { lat: 999, lng: 0 } }).success).toBe(
      false,
    )
  })

  it('coerces capturedAt ISO string to a Date', () => {
    const result = MemorySchema.safeParse({
      ...validMemory,
      capturedAt: '2024-06-15T12:00:00.000Z',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.capturedAt).toBeInstanceOf(Date)
  })
})

describe('MemoryMediaSchema', () => {
  it('accepts a valid media row', () => {
    expect(MemoryMediaSchema.safeParse(validMedia).success).toBe(true)
  })

  it('rejects an unknown media type', () => {
    expect(MemoryMediaSchema.safeParse({ ...validMedia, mediaType: 'audio' }).success).toBe(false)
  })

  it('accepts null width/height from the DB', () => {
    expect(MemoryMediaSchema.safeParse({ ...validMedia, width: null, height: null }).success).toBe(
      true,
    )
  })
})

describe('CreateMemorySchema', () => {
  it('accepts a valid create payload without server-generated fields', () => {
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...createFields } = validMemory
    expect(CreateMemorySchema.safeParse(createFields).success).toBe(true)
  })

  it('defaults mediaType to photo on create media items', () => {
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...createFields } = validMemory
    const result = CreateMemorySchema.safeParse({
      ...createFields,
      media: [{ url: 'https://example.com/photo.jpg' }],
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.media[0]?.mediaType).toBe('photo')
  })
})

describe('CreateMemoryFormSchema', () => {
  const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...createFields } = validMemory

  it('rejects a memory with neither note nor media', () => {
    expect(CreateMemoryFormSchema.safeParse(createFields).success).toBe(false)
  })

  it('accepts a memory with only a note', () => {
    expect(CreateMemoryFormSchema.safeParse({ ...createFields, note: 'hello' }).success).toBe(true)
  })

  it('accepts a memory with only media', () => {
    expect(
      CreateMemoryFormSchema.safeParse({
        ...createFields,
        media: [{ url: 'https://example.com/photo.jpg' }],
      }).success,
    ).toBe(true)
  })
})
