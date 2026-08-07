'use client'

import { useUser as useClerkUser } from '@clerk/nextjs'
import { useDeleteAccount, useUser } from '@passe/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@passe/ui/alert-dialog'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { Input } from '@passe/ui/input'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

const CONFIRM_PHRASE = 'delete my account'

export function DangerZone() {
  const t = useTranslations('account.danger')
  const tErrors = useTranslations('account.errors')
  const router = useRouter()
  const { user: clerkUser } = useClerkUser()
  const { data: user } = useUser()
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount()
  const isManagedOnMobile = user?.planSource === 'revenuecat'
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen(false)
    setConfirmation('')
    setError(null)
  }

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteAccount()
      await clerkUser?.reload()
      router.push(routes.signIn)
    } catch (err) {
      setError(err instanceof Error ? err.message : tErrors('delete_failed'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-destructive">{t('title')}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('description')}</p>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Icon name="alert" size="md" className="text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('delete_title')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('delete_description')}</p>
          </div>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={<Button variant="destructive" icon="delete" iconPosition="start" />}
          >
            {t('delete')}
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Icon name="alert" size="lg" className="text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('warning')}</AlertDialogDescription>
            </AlertDialogHeader>

            {isManagedOnMobile && (
              <div className="mx-1 rounded-lg border border-border bg-muted p-3">
                <p className="text-sm text-muted-foreground">{t('iap_cancel_warning')}</p>
              </div>
            )}

            <div className="space-y-1.5 px-1">
              <label htmlFor="delete-confirm" className="text-sm font-medium text-foreground">
                {t('confirm_label')}
              </label>
              <Input
                id="delete-confirm"
                type="text"
                placeholder={t('confirm_placeholder')}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="off"
              />
              {error && <p className="text-xs text-destructive pt-1">{error}</p>}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={confirmation !== CONFIRM_PHRASE || isPending}
                isLoading={isPending}
                onClick={handleDelete}
              >
                {isPending ? t('deleting') : t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
