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
import { useTranslations } from '@/i18n/useTranslations'

interface DeletePhotoAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

// Mirrors MemoryLayoutMenu's controlled delete-confirm pattern (same
// component set, same open/onOpenChange shape).
export function DeletePhotoAlert({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeletePhotoAlertProps) {
  const t = useTranslations('trips.memory_detail')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete_photo_title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('delete_photo_description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('delete_photo_cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="danger" loading={isPending} onPress={onConfirm}>
            {t('delete_photo_confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
