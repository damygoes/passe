import { describe, expect, it } from 'vitest'
import { formatMemoryDateTime } from '../date'

describe('formatMemoryDateTime', () => {
  it('formats as full date · time', () => {
    expect(formatMemoryDateTime(new Date('2026-03-11T18:42:00'))).toBe('11 March 2026 · 18:42')
  })
})
