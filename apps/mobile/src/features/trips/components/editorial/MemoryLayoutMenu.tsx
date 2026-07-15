import { useDeleteMemory, useReorderMemories, useUpdateMemory } from '@passe/hooks'
import type { LayoutVariant, Memory } from '@passe/types/memory'
import type { EditorialSectionVariant } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

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
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { createMemoryLayoutMenuRecipe } from '@/recipes/memory-layout-menu'

const VARIANT_OPTIONS: LayoutVariant[] = [
  'auto',
  'hero',
  'image_left',
  'image_right',
  'carousel',
  'text',
]

interface MemoryLayoutMenuProps {
  memory: Memory
  resolvedVariant: EditorialSectionVariant
  orderedIds: string[]
  index: number
}

export function MemoryLayoutMenu({
  memory,
  resolvedVariant,
  orderedIds,
  index,
}: MemoryLayoutMenuProps) {
  const t = useTranslations('trips.editorial')
  const tCard = useTranslations('trips.memory_card')
  const tEdit = useTranslations('trips.edit_memory')
  const router = useRouter()
  const theme = useTheme()
  const recipe = useMemo(() => createMemoryLayoutMenuRecipe(theme), [theme])
  const updateMemory = useUpdateMemory()
  const reorderMemories = useReorderMemories()
  const deleteMemory = useDeleteMemory()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isImageText = resolvedVariant === 'imageLeft' || resolvedVariant === 'imageRight'
  const isBusy = updateMemory.isPending || reorderMemories.isPending

  function setVariant(layoutVariant: LayoutVariant) {
    setError(null)
    updateMemory.mutate(
      { id: memory.id, tripId: memory.tripId, layoutVariant },
      { onError: () => setError(tEdit('update_failed')) },
    )
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

  return (
    <View style={recipe.base.container}>
      <View style={recipe.base.row}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <View style={[recipe.base.trigger, isBusy && recipe.states.disabled.trigger]}>
              <Icon name="layout" size="sm" color={theme.colors.mutedForeground} />
              <Text style={recipe.base.triggerLabel}>{t(`variant_${memory.layoutVariant}`)}</Text>
            </View>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {VARIANT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option}
                onPress={() => setVariant(option)}
                icon={
                  memory.layoutVariant === option ? (
                    <Icon name="check" size="sm" color={theme.colors.primary} />
                  ) : undefined
                }
              >
                {t(`variant_${option}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isImageText && (
          <Pressable
            onPress={handleFlip}
            disabled={isBusy}
            hitSlop={8}
            style={[recipe.base.iconButton, isBusy && recipe.states.disabled.iconButton]}
            accessibilityLabel={t('flip')}
          >
            <Icon name="swap" size="sm" color={theme.colors.mutedForeground} />
          </Pressable>
        )}

        <Pressable
          onPress={() => handleMove(-1)}
          disabled={isBusy || index === 0}
          hitSlop={8}
          style={[
            recipe.base.iconButton,
            (isBusy || index === 0) && recipe.states.disabled.iconButton,
          ]}
          accessibilityLabel={t('move_up')}
        >
          <Icon name="chevron-up" size="sm" color={theme.colors.mutedForeground} />
        </Pressable>

        <Pressable
          onPress={() => handleMove(1)}
          disabled={isBusy || index === orderedIds.length - 1}
          hitSlop={8}
          style={[
            recipe.base.iconButton,
            (isBusy || index === orderedIds.length - 1) && recipe.states.disabled.iconButton,
          ]}
          accessibilityLabel={t('move_down')}
        >
          <Icon name="chevronDown" size="sm" color={theme.colors.mutedForeground} />
        </Pressable>

        <Pressable
          onPress={handleTogglePublic}
          disabled={updateMemory.isPending}
          hitSlop={8}
          style={[
            recipe.base.iconButton,
            updateMemory.isPending && recipe.states.disabled.iconButton,
          ]}
          accessibilityLabel={memory.isPublic ? tCard('make_private') : tCard('make_public')}
        >
          <Icon
            name={memory.isPublic ? 'eye' : 'eye-off'}
            size="sm"
            color={theme.colors.mutedForeground}
          />
        </Pressable>

        <Pressable
          onPress={handleEdit}
          hitSlop={8}
          style={recipe.base.iconButton}
          accessibilityLabel={tCard('edit')}
        >
          <Icon name="edit" size="sm" color={theme.colors.mutedForeground} />
        </Pressable>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger>
            <View style={recipe.base.iconButton} accessibilityLabel={tCard('delete')}>
              <Icon name="delete" size="sm" color={theme.colors.destructive} />
            </View>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tCard('delete_title')}</AlertDialogTitle>
              <AlertDialogDescription>{tCard('delete_description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCard('delete_cancel')}</AlertDialogCancel>
              <AlertDialogAction
                variant="danger"
                loading={deleteMemory.isPending}
                onPress={handleDelete}
              >
                {tCard('delete_confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>

      {error && <ErrorBanner message={error} />}
    </View>
  )
}
