import type { Memory } from '@passe/types/memory'

type UniqueCities = {
  uniqueCities: Set<any>
}

export function getUniqueCities({ allMemories }: { allMemories: Memory[] }): UniqueCities {
  const uniqueCities = new Set(allMemories.flatMap((memory) => (memory.city ? [memory.city] : [])))
  return {
    uniqueCities,
  }
}
