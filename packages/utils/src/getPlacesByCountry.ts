import type { Memory } from '@passe/types/memory'

export interface PlaceGroup {
  country: string
  cityCount: number
}

/**
 * Groups memories by country and counts the distinct cities visited in
 * each — the Home screen's "by place" list ("Morocco — 3 cities"). Callers
 * filter `memories` to a time window (e.g. the current year) before calling
 * this, since the grouping itself is time-agnostic. Sorted by city count
 * descending; countries with no named city are dropped (nothing to count).
 */
export function getPlacesByCountry({
  memories,
}: {
  memories: Pick<Memory, 'city' | 'country'>[]
}): PlaceGroup[] {
  const citiesByCountry = new Map<string, Set<string>>()

  for (const memory of memories) {
    if (!memory.country) continue
    const cities = citiesByCountry.get(memory.country) ?? new Set<string>()
    if (memory.city) cities.add(memory.city)
    citiesByCountry.set(memory.country, cities)
  }

  return [...citiesByCountry.entries()]
    .map(([country, cities]) => ({ country, cityCount: cities.size }))
    .filter((group) => group.cityCount > 0)
    .sort((a, b) => b.cityCount - a.cityCount)
}
