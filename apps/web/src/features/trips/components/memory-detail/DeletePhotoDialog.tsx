'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@passe/ui/alert-dialog'
import { useTranslations } from 'next-intl'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

// Mirrors TripDetailHeader's delete-confirm pattern (same component set,
// same controlled-open shape).
export function DeletePhotoDialog({ open, onOpenChange, onConfirm, isPending }: Props) {
  const t = useTranslations('trips.memory_detail')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete_photo_title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('delete_photo_description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t('delete_photo_cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            isLoading={isPending}
            onClick={onConfirm}
          >
            {t('delete_photo_confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
