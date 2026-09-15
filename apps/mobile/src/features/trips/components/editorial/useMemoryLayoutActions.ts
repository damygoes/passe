import { useDeleteMemory, useReorderMemories, useUpdateMemory } from '@passe/hooks'
import type { LayoutVariant, Memory } from '@passe/types/memory'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { useTranslations } from '@/i18n/useTranslations'

// Pulled out of MemoryLayoutMenu so the mutation/reorder/navigation logic can
// be unit-tested directly — DropdownMenuTrigger opens via measureInWindow,
// which never resolves under Jest's test renderer (see DropdownMenu.test.tsx),
// so driving this logic through the rendered dropdown isn't possible there.
export function useMemoryLayoutActions(memory: Memory, orderedIds: string[], index: number) {
  const tCard = useTranslations('trips.memory_card')
  const tEdit = useTranslations('trips.edit_memory')
  const router = useRouter()
  const updateMemory = useUpdateMemory()
  const reorderMemories = useReorderMemories()
  const deleteMemory = useDeleteMemory()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isBusy = updateMemory.isPending || reorderMemories.isPending

  function setVariant(layoutVariant: LayoutVariant) {
    setError(null)
    updateMemory.mutate(
      { id: memory.id, tripId: memory.tripId, layoutVariant },
      { onError: () => setError(tEdit('update_failed')) },
    )
  }

  function handleMove(direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= orderedIds.length) return
    const next = [...orderedIds]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved!)
    setError(null)
    reorderMemories.mutate(
      { tripId: memory.tripId, orderedIds: next },
      { onError: () => setError(tEdit('update_failed')) },
    )
  }

  function handleTogglePublic() {
    setError(null)
    updateMemory.mutate(
      { id: memory.id, tripId: memory.tripId, isPublic: !memory.isPublic },
      { onError: () => setError(tEdit('update_failed')) },
    )
  }

  function handleEdit() {
    router.push(`/(app)/trips/edit-memory/${memory.id}?tripId=${memory.tripId}`)
  }

  function handleDelete() {
    setError(null)
    deleteMemory.mutate(
      { id: memory.id, tripId: memory.tripId },
      { onError: () => setError(tCard('delete_failed')) },
    )
  }

  return {
    isBusy,
    error,
    setVariant,
    handleMove,
    handleTogglePublic,
    handleEdit,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    isDeleting: deleteMemory.isPending,
  }
}
