import { describe, expect, it } from 'vitest'
import { buildEditorialChapters, type EditorialMemoryInput } from '../editorial'

let counter = 0
function memory(overrides: Partial<EditorialMemoryInput>): EditorialMemoryInput {
  counter += 1
  return {
    id: `00000000-0000-0000-0000-${String(counter).padStart(12, '0')}`,
    note: null,
    city: null,
    country: null,
    capturedAt: new Date('2025-10-01'),
    layoutVariant: 'auto',
    sortOrder: null,
    media: [],
    ...overrides,
  }
}

const photo = (n = 1) => Array.from({ length: n }, (_, i) => ({ url: `https://x.com/${i}.jpg` }))

describe('buildEditorialChapters — ordering', () => {
  it('orders chronologically ascending by default', () => {
    const first = memory({ capturedAt: new Date('2025-10-01'), note: 'a' })
    const second = memory({ capturedAt: new Date('2025-10-05'), note: 'b' })
    const chapters = buildEditorialChapters([second, first])
    const ids = chapters.flatMap((c) => c.sections.map((s) => s.memory.id))
    expect(ids).toEqual([first.id, second.id])
  })

  it('puts explicit sortOrder before unordered memories', () => {
    const unordered = memory({ capturedAt: new Date('2025-10-01'), note: 'a' })
    const pinned = memory({ capturedAt: new Date('2025-10-09'), note: 'b', sortOrder: 0 })
    const chapters = buildEditorialChapters([unordered, pinned])
    const ids = chapters.flatMap((c) => c.sections.map((s) => s.memory.id))
    expect(ids).toEqual([pinned.id, unordered.id])
  })
})

describe('buildEditorialChapters — chapters', () => {
  it('groups consecutive memories by city and falls back to month', () => {
    const chapters = buildEditorialChapters([
      memory({ city: 'Marrakech', note: 'a' }),
      memory({ city: 'Marrakech', note: 'b' }),
      memory({ city: 'Fes', note: 'c' }),
      memory({ note: 'd' }), // no city/country → month label
    ])
    expect(chapters.map((c) => c.title)).toEqual(['Marrakech', 'Fes', 'Oct 2025'])
    // consecutive same-city memories share one chapter
    expect(chapters[0]?.sections).toHaveLength(2)
    // month-titled chapter omits the duplicate subtitle
    expect(chapters[2]?.subtitle).toBeUndefined()
  })
})

describe('buildEditorialChapters — auto variants', () => {
  it('maps content shape to variants', () => {
    const chapters = buildEditorialChapters([
      memory({ city: 'X', note: 'only text' }),
      memory({ city: 'X', media: photo(1) }),
      memory({ city: 'X', media: photo(2) }),
      memory({ city: 'X', note: 'n', media: photo(1) }),
      memory({ city: 'X', note: 'n', media: photo(3) }),
    ])
    const variants = chapters[0]?.sections.map((s) => s.variant)
    expect(variants).toEqual(['text', 'hero', 'carousel', 'imageLeft', 'carousel'])
  })

  it('alternates image/text sides within a chapter', () => {
    const chapters = buildEditorialChapters([
      memory({ city: 'X', note: 'a', media: photo(1) }),
      memory({ city: 'X', note: 'b', media: photo(1) }),
      memory({ city: 'X', note: 'c', media: photo(1) }),
    ])
    expect(chapters[0]?.sections.map((s) => s.variant)).toEqual([
      'imageLeft',
      'imageRight',
      'imageLeft',
    ])
  })
})

describe('buildEditorialChapters — manual overrides', () => {
  it('honours overrides and guards impossible ones', () => {
    const chapters = buildEditorialChapters([
      memory({ city: 'X', note: 'n', media: photo(1), layoutVariant: 'image_right' }),
      memory({ city: 'X', media: photo(2), layoutVariant: 'hero' }),
      memory({ city: 'X', note: 'n', media: photo(1), layoutVariant: 'carousel' }), // 1 photo → hero
      memory({ city: 'X', note: 'n', layoutVariant: 'hero' }), // no photo → text
      memory({ city: 'X', note: 'n', media: photo(1), layoutVariant: 'text' }),
    ])
    expect(chapters[0]?.sections.map((s) => s.variant)).toEqual([
      'imageRight',
      'hero',
      'hero',
      'text',
      'text',
    ])
  })
})
