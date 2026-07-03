import { describe, it, expect } from 'vitest'
import { UserSchema, PublicUserSchema, UpdateUserSchema } from '../user'

const validUser = {
  id: 'user_2abc123xyz',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  plan: 'free' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('UserSchema', () => {
  it('accepts a valid user', () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(UserSchema.safeParse({ ...validUser, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a plan outside the enum', () => {
    expect(UserSchema.safeParse({ ...validUser, plan: 'premium' }).success).toBe(false)
  })

  it('defaults plan to free when omitted', () => {
    const { plan: _, ...withoutPlan } = validUser
    const result = UserSchema.safeParse(withoutPlan)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.plan).toBe('free')
  })

  it('accepts optional bio and avatarUrl when absent', () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true)
  })

  it('coerces createdAt ISO string to a Date', () => {
    const result = UserSchema.safeParse({ ...validUser, createdAt: '2024-01-01T00:00:00.000Z' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.createdAt).toBeInstanceOf(Date)
  })
})

describe('PublicUserSchema', () => {
  it('only exposes public fields', () => {
    const result = PublicUserSchema.safeParse(validUser)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveProperty('id')
      expect(result.data).toHaveProperty('username')
      expect(result.data).toHaveProperty('displayName')
      expect(result.data).not.toHaveProperty('email')
      expect(result.data).not.toHaveProperty('clerkId')
      expect(result.data).not.toHaveProperty('plan')
      expect(result.data).not.toHaveProperty('createdAt')
    }
  })
})

describe('UpdateUserSchema', () => {
  it('accepts an empty object — all fields are optional', () => {
    expect(UpdateUserSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a partial update', () => {
    expect(UpdateUserSchema.safeParse({ displayName: 'New Name' }).success).toBe(true)
  })

  it('rejects a username that is too short', () => {
    expect(UpdateUserSchema.safeParse({ username: 'ab' }).success).toBe(false)
  })

  it('rejects a username longer than 30 characters', () => {
    expect(UpdateUserSchema.safeParse({ username: 'a'.repeat(31) }).success).toBe(false)
  })
})
