import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolves Tailwind conflicts — last class wins', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('p-4', 'p-8')).toBe('p-8')
    expect(cn('font-bold', 'font-normal')).toBe('font-normal')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', null, undefined, false, '')).toBe('foo')
  })

  it('handles conditional objects', () => {
    expect(cn({ 'font-bold': true, italic: false })).toBe('font-bold')
  })

  it('returns empty string when all inputs are falsy', () => {
    expect(cn(null, undefined, false)).toBe('')
  })

  it('handles arrays of classes', () => {
    expect(cn(['flex', 'items-center'])).toBe('flex items-center')
  })

  it('handles no arguments', () => {
    expect(cn()).toBe('')
  })
})
