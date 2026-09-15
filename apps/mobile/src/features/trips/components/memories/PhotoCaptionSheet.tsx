import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface PhotoCaptionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCaption: string
  onSave: (caption: string) => void
}

// Reuses the AlertDialog modal primitive rather than building bottom-sheet
// infrastructure with no precedent elsewhere in this codebase.
export function PhotoCaptionSheet({
  open,
  onOpenChange,
  initialCaption,
  onSave,
}: PhotoCaptionSheetProps) {
  const t = useTranslations('trips.memory_detail')
  const { spacing } = useTheme()
  const [value, setValue] = useState(initialCaption)
  // Re-seed the field during render (not in an effect) each time the sheet
  // transitions from closed to open — the documented alternative to
  // useEffect for adjusting state in response to a prop change.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setValue(initialCaption)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('edit_caption')}</AlertDialogTitle>
        </AlertDialogHeader>
        <Textarea
          value={value}
          onChangeText={setValue}
          placeholder={t('caption_placeholder')}
          maxLength={300}
          numberOfLines={3}
          style={{ marginBottom: spacing[2] }}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('caption_cancel')}</AlertDialogCancel>
          <AlertDialogAction onPress={() => onSave(value.trim())}>
            {t('caption_save')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
