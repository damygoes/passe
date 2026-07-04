import type { DbMemory, DbMemoryMedia } from '@passe/db/schema'

export function fromDbMemory(row: DbMemory & { media?: DbMemoryMedia[] }) {
  const { lat, lng, media, ...rest } = row
  return {
    ...rest,
    location: lat != null && lng != null ? { lat, lng } : null,
    media: media ?? [],
  }
}

// Maps API input to memories-table values. Media rows live in memory_media
// and are inserted separately, so `media` is stripped here.
export function toDbMemoryValues<
  T extends { location?: { lat: number; lng: number } | null; media?: unknown },
>(data: T) {
  const { location, media, ...rest } = data
  void media
  return { ...rest, lat: location?.lat ?? null, lng: location?.lng ?? null }
}
