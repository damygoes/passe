export const queryKeys = {
  user: () => ['user'] as const,
  trips: () => ['trips'] as const,
  trip: (id: string) => ['trips', id] as const,
  memories: (tripId: string) => ['trips', tripId, 'memories'] as const,
  allMemories: () => ['memories'] as const,
  mapPoints: () => ['memories', 'map'] as const,
}
