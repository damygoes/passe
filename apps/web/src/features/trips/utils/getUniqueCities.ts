import type { Memory } from '@passe/types/memory'

type UniqueCities = {
  uniqueCities: Set<string>
}

export function getUniqueCities({ allMemories }: { allMemories: Memory[] }): UniqueCities {
  const uniqueCities = new Set(allMemories.flatMap((memory) => (memory.city ? [memory.city] : [])))
  return {
    uniqueCities,
  }
}
