import { describe, expect, it } from 'vitest'
import { formatWeekdayDate } from '../date'

describe('formatWeekdayDate', () => {
  it('formats as weekday, day month year by default', () => {
    expect(formatWeekdayDate(new Date('2026-05-12'))).toBe('Tuesday, 12 May 2026')
  })

  it('omits the year when withYear is false', () => {
    expect(formatWeekdayDate(new Date('2026-05-12'), { withYear: false })).toBe('Tuesday, 12 May')
  })

  it('accepts a date string', () => {
    expect(formatWeekdayDate('2026-05-12')).toBe('Tuesday, 12 May 2026')
  })
})
