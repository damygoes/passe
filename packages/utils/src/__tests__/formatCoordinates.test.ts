import { describe, expect, it } from 'vitest'
import { formatCoordinates } from '../formatCoordinates'

describe('formatCoordinates', () => {
  it('formats northern/western coordinates', () => {
    expect(formatCoordinates(35.1688, -5.2636)).toBe('35.1688° N, 5.2636° W')
  })

  it('formats southern/eastern coordinates', () => {
    expect(formatCoordinates(-13.53, -71.97)).toBe('13.5300° S, 71.9700° W')
  })

  it('treats zero as the positive hemisphere', () => {
    expect(formatCoordinates(0, 0)).toBe('0.0000° N, 0.0000° E')
  })
})
