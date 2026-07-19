import type { DbMemory, DbMemoryMedia } from '@passe/db/schema'
import { resolveMemoryMedia } from './media'

// The single place every memory read goes through — resolving media.url
// into a signed delivery URL here (rather than at each call site) means
// every route that uses fromDbMemory gets the fix for free.
export function fromDbMemory(row: DbMemory & { media?: DbMemoryMedia[] }) {
  const { lat, lng, media, ...rest } = row
  return resolveMemoryMedia({
    ...rest,
    location: lat != null && lng != null ? { lat, lng } : null,
    media: media ?? [],
  })
}

// Maps API input to memories-table values. Media rows live in memory_media
// and are inserted separately, so `media` is stripped here.
//
// `location` is only written when the caller actually included it — partial
// updates that don't mention location (e.g. editing just the note) must not
// clobber an existing memory's coordinates back to null.
export function toDbMemoryValues<
  T extends { location?: { lat: number; lng: number } | null; media?: unknown },
>(data: T) {
  const { media, ...rest } = data
  void media
  if (!('location' in rest)) return rest
  const { location, ...withoutLocation } = rest
  return { ...withoutLocation, lat: location?.lat ?? null, lng: location?.lng ?? null }
}
