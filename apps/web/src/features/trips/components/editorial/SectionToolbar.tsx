'use client'

import { useDeleteMemory, useReorderMemories, useUpdateMemory } from '@passe/hooks'
import type { LayoutVariant, Memory } from '@passe/types/memory'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@passe/ui/alert-dialog'
import { Button } from '@passe/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import type { EditorialSectionVariant } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const VARIANT_OPTIONS: LayoutVariant[] = [
  'auto',
  'hero',
  'image_left',
  'image_right',
  'carousel',
  'text',
]

interface Props {
  memory: Memory
  // What the layout engine actually rendered (never 'auto')
  resolvedVariant: EditorialSectionVariant
  // Current full display order of the trip's memories
  orderedIds: string[]
  index: number
}

export function SectionToolbar({ memory, resolvedVariant, orderedIds, index }: Props) {
  const t = useTranslations('trips.editorial')
  const tCard = useTranslations('trips.memory_card')
  const updateMemory = useUpdateMemory()
  const reorderMemories = useReorderMemories()
  const deleteMemory = useDeleteMemory()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const isImageText = resolvedVariant === 'imageLeft' || resolvedVariant === 'imageRight'
  const isBusy = updateMemory.isPending || reorderMemories.isPending

  function setVariant(layoutVariant: LayoutVariant) {
    updateMemory.mutate({ id: memory.id, tripId: memory.tripId, layoutVariant })
  }

  function handleFlip() {
    setVariant(resolvedVariant === 'imageLeft' ? 'image_right' : 'image_left')
  }

  function handleMove(direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= orderedIds.length) return
    const next = [...orderedIds]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved!)
    reorderMemories.mutate({ tripId: memory.tripId, orderedIds: next })
  }

  function handleTogglePublic() {
    updateMemory.mutate({ id: memory.id, tripId: memory.tripId, isPublic: !memory.isPublic })
  }

  async function handleDelete() {
    await deleteMemory.mutateAsync({ id: memory.id, tripId: memory.tripId })
    setDeleteOpen(false)
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1 opacity-60 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              disabled={isBusy}
            />
          }
        >
          <Icon name="layout" size="sm" />
          {t(`variant_${memory.layoutVariant}`)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {VARIANT_OPTIONS.map((option) => (
            <DropdownMenuItem key={option} onClick={() => setVariant(option)}>
              {t(`variant_${option}`)}
              {memory.layoutVariant === option && <Icon name="check" size="sm" className="ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isImageText && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleFlip}
          disabled={isBusy}
          aria-label={t('flip')}
        >
          <Icon name="swap" size="sm" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleMove(-1)}
        disabled={isBusy || index === 0}
        aria-label={t('move_up')}
      >
        <Icon name="chevron-up" size="sm" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleMove(1)}
        disabled={isBusy || index === orderedIds.length - 1}
        aria-label={t('move_down')}
      >
        <Icon name="chevronDown" size="sm" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleTogglePublic}
        disabled={updateMemory.isPending}
        className="gap-1.5 text-xs text-muted-foreground"
        aria-label={memory.isPublic ? tCard('make_private') : tCard('make_public')}
      >
        <Icon name={memory.isPublic ? 'eye' : 'eye-off'} size="sm" />
        {memory.isPublic ? tCard('public_label') : tCard('private_label')}
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={tCard('delete')}
            />
          }
        >
          <Icon name="delete" size="sm" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCard('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>{tCard('delete_description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
              {tCard('delete_cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMemory.isPending}
              isLoading={deleteMemory.isPending}
              onClick={handleDelete}
            >
              {tCard('delete_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
