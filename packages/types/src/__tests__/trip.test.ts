import { describe, it, expect } from 'vitest'
import { TripSchema, CreateTripSchema, UpdateTripSchema } from '../trip'

const validTrip = {
  id: '00000000-0000-0000-0000-000000000001',
  userId: '00000000-0000-0000-0000-000000000002',
  title: 'Japan Adventure',
  countries: ['JP'],
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('TripSchema', () => {
  it('accepts a valid trip', () => {
    expect(TripSchema.safeParse(validTrip).success).toBe(true)
  })

  it('coerces ISO date strings to Date objects', () => {
    const result = TripSchema.safeParse({
      ...validTrip,
      startDate: '2024-03-01T00:00:00.000Z',
      endDate: '2024-03-15T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
      expect(result.data.endDate).toBeInstanceOf(Date)
    }
  })

  it('rejects an empty countries array', () => {
    expect(TripSchema.safeParse({ ...validTrip, countries: [] }).success).toBe(false)
  })

  it('accepts multiple countries', () => {
    expect(TripSchema.safeParse({ ...validTrip, countries: ['JP', 'KR', 'TW'] }).success).toBe(true)
  })

  it('rejects a title exceeding 100 characters', () => {
    expect(TripSchema.safeParse({ ...validTrip, title: 'a'.repeat(101) }).success).toBe(false)
  })

  it('rejects an empty title', () => {
    expect(TripSchema.safeParse({ ...validTrip, title: '' }).success).toBe(false)
  })

  it('defaults isPublic to true when omitted', () => {
    const { isPublic: _, ...withoutIsPublic } = validTrip
    const result = TripSchema.safeParse(withoutIsPublic)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.isPublic).toBe(true)
  })

  it('accepts optional description and coverImageUrl when absent', () => {
    expect(TripSchema.safeParse(validTrip).success).toBe(true)
  })
})

describe('CreateTripSchema', () => {
  it('accepts a valid create payload without server-generated fields', () => {
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...createFields } = validTrip
    expect(CreateTripSchema.safeParse(createFields).success).toBe(true)
  })
})

describe('UpdateTripSchema', () => {
  it('accepts an empty object — all fields are optional', () => {
    expect(UpdateTripSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a partial update', () => {
    expect(UpdateTripSchema.safeParse({ title: 'Updated Title' }).success).toBe(true)
  })

  it('still validates provided fields', () => {
    expect(UpdateTripSchema.safeParse({ countries: [] }).success).toBe(false)
  })
})
