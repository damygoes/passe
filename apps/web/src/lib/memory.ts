import type { DbMemory } from '@passe/db/schema'

export function fromDbMemory(row: DbMemory) {
  const { lat, lng, ...rest } = row
  return { ...rest, location: lat != null && lng != null ? { lat, lng } : null }
}

export function toDbMemoryValues<T extends { location?: { lat: number; lng: number } | null }>(
  data: T,
) {
  const { location, ...rest } = data
  return { ...rest, lat: location?.lat ?? null, lng: location?.lng ?? null }
}
