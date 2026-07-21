import { describe, expect, it } from 'vitest'
import { truncatePdfNote } from './pdf-text'

describe('truncatePdfNote', () => {
  it('returns the note unchanged when under the limit', () => {
    expect(truncatePdfNote('short note', 20)).toBe('short note')
  })

  it('returns the note unchanged at the exact limit', () => {
    expect(truncatePdfNote('12345', 5)).toBe('12345')
  })

  it('truncates and appends an ellipsis when over the limit', () => {
    expect(truncatePdfNote('this is a long note', 10)).toBe('this is a…')
  })

  it('trims trailing whitespace before appending the ellipsis', () => {
    expect(truncatePdfNote('word boundary here', 5)).toBe('word…')
  })
})
