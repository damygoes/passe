import { describe, expect, it } from 'vitest'
import { createMediaLoader } from './media-image-loader'

describe('createMediaLoader', () => {
  const urlsByWidth = {
    '480': 'https://example.com/media?w=480',
    '750': 'https://example.com/media?w=750',
    '1600': 'https://example.com/media?w=1600',
    '2048': 'https://example.com/media?w=2048',
  }

  it('picks the smallest bucket that is >= the requested width', () => {
    const loader = createMediaLoader(urlsByWidth)
    expect(loader({ src: 'ignored', width: 500, quality: 75 })).toBe(urlsByWidth['750'])
  })

  it('picks the exact bucket when the requested width matches one', () => {
    const loader = createMediaLoader(urlsByWidth)
    expect(loader({ src: 'ignored', width: 1600, quality: 75 })).toBe(urlsByWidth['1600'])
  })

  it('falls back to the largest bucket when the requested width exceeds all of them', () => {
    const loader = createMediaLoader(urlsByWidth)
    expect(loader({ src: 'ignored', width: 4000, quality: 75 })).toBe(urlsByWidth['2048'])
  })

  it('picks the smallest bucket for a width below every bucket', () => {
    const loader = createMediaLoader(urlsByWidth)
    expect(loader({ src: 'ignored', width: 100, quality: 75 })).toBe(urlsByWidth['480'])
  })
})
