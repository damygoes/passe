import type { LayoutVariant, Memory } from '@passe/types/memory'
import { useMemo } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { useMemoryLayoutActions } from './useMemoryLayoutActions'

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
  orderedIds: string[]
  index: number
  style?: StyleProp<ViewStyle>
}

// Compact "…" trigger for a masonry tile — same capabilities the old
// full-width editorial toolbar had (layout variant, reorder, publish toggle,
// edit, delete), just collapsed into one dropdown so it fits a narrow tile.
export function MemoryLayoutMenu({ memory, orderedIds, index, style }: MemoryLayoutMenuProps) {
  const t = useTranslations('trips.editorial')
  const tCard = useTranslations('trips.memory_card')
  const { colors } = useTheme()
  const {
    isBusy,
    error,
    setVariant,
    handleMove,
    handleTogglePublic,
    handleEdit,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    isDeleting,
  } = useMemoryLayoutActions(memory, orderedIds, index)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        trigger: {
          width: 30,
          height: 30,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
      }),
    [],
  )

  return (
    <View style={style}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <View
            style={styles.trigger}
            accessibilityRole="button"
            accessibilityLabel={t('menu_label')}
          >
            <GlassSurface shape="circle" style={StyleSheet.absoluteFill} />
            <Icon name="more" size="sm" color={colors.foreground} />
          </View>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t('layout_label')}</DropdownMenuLabel>
          {VARIANT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option}
              disabled={isBusy}
              onPress={() => setVariant(option)}
              icon={
                (memory.layoutVariant ?? 'auto') === option ? (
                  <Icon name="check" size="sm" color={colors.primary} />
                ) : undefined
              }
            >
              {t(`variant_${option}`)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isBusy || index === 0} onPress={() => handleMove(-1)}>
            {t('move_up')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isBusy || index === orderedIds.length - 1}
            onPress={() => handleMove(1)}
          >
            {t('move_down')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isBusy} onPress={handleTogglePublic}>
            {memory.isPublic ? tCard('make_private') : tCard('make_public')}
          </DropdownMenuItem>
          <DropdownMenuItem onPress={handleEdit}>{tCard('edit')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onPress={() => setDeleteOpen(true)}>
            {tCard('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* No visible trigger — AlertDialog's `open` is fully controlled, opened
          programmatically from the dropdown's Delete item above */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCard('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>{tCard('delete_description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCard('delete_cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="danger" loading={isDeleting} onPress={handleDelete}>
              {tCard('delete_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && <ErrorBanner message={error} />}
    </View>
  )
}
