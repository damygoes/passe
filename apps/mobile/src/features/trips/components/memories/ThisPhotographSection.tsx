import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { DeletePhotoAlert } from './DeletePhotoAlert'
import { PhotoCaptionSheet } from './PhotoCaptionSheet'

interface ThisPhotographSectionProps {
  caption: string | null
  isCover: boolean
  isPending: boolean
  onSetCover: () => void
  onSaveCaption: (caption: string) => void
  onDelete: () => void
}

// Per-photo content — mirrors the web "This photograph" card's cover/
// caption/delete controls, kept out of the memory-level body per the
// design spec's explicit boundary.
export function ThisPhotographSection({
  caption,
  isCover,
  isPending,
  onSetCover,
  onSaveCaption,
  onDelete,
}: ThisPhotographSectionProps) {
  const t = useTranslations('trips.memory_detail')
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        caption: { fontSize: fontSizes.sm, lineHeight: 20, color: colors.foreground },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
          marginTop: spacing[3],
        },
        trigger: {
          width: 30,
          height: 30,
          borderRadius: borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginLeft: 'auto',
        },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}

      <View style={styles.row}>
        <Button variant="secondary" size="sm" disabled={isPending || isCover} onPress={onSetCover}>
          {isCover ? t('cover_photograph') : t('make_cover')}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <View
              style={styles.trigger}
              accessibilityRole="button"
              accessibilityLabel={t('photo_options')}
            >
              <GlassSurface shape="circle" style={StyleSheet.absoluteFill} />
              <Icon name="more" size="sm" color={colors.foreground} />
            </View>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onPress={() => setIsEditingCaption(true)}>
              {t('edit_caption')}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onPress={() => setIsDeleteOpen(true)}>
              {t('delete_photo')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      <PhotoCaptionSheet
        open={isEditingCaption}
        onOpenChange={setIsEditingCaption}
        initialCaption={caption ?? ''}
        onSave={(next) => {
          onSaveCaption(next)
          setIsEditingCaption(false)
        }}
      />

      <DeletePhotoAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        isPending={isPending}
        onConfirm={onDelete}
      />
    </View>
  )
}
