import { describe, expect, it } from 'vitest'
import { formatMemoryDate } from '../date'

describe('formatMemoryDate', () => {
  it('formats as day + short month, no year', () => {
    expect(formatMemoryDate(new Date('2026-03-11'))).toBe('11 Mar')
  })

  it('accepts a date string', () => {
    expect(formatMemoryDate('2026-03-11')).toBe('11 Mar')
  })
})
