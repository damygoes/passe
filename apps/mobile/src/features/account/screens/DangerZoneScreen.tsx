import { useClerk } from '@clerk/expo'
import { useDeleteAccount, useUser } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const CONFIRM_PHRASE = 'delete my account'

export function DangerZoneScreen() {
  const { colors, spacing, borderRadius, fontSizes, fontWeights } = useTheme()
  const t = useTranslations('account.danger')
  const tTabs = useTranslations('account.tabs')
  const tCommon = useTranslations('common')
  const tErrors = useTranslations('account.errors')
  const router = useRouter()
  const { signOut } = useClerk()
  const { data: user } = useUser()
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isManagedOnMobile = user?.planSource === 'revenuecat'

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: `${colors.destructive}4D`,
          backgroundColor: `${colors.destructive}0D`,
          padding: spacing[5],
          gap: spacing[6],
        },
        cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
        cardText: { flex: 1, gap: spacing[1] },
        cardTitle: {
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          color: colors.foreground,
        },
        cardDescription: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        dialogBody: { gap: spacing[2], marginTop: spacing[2] },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
        iapWarning: {
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.muted,
          padding: spacing[3],
        },
        iapWarningText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
      }),
    [colors, spacing, borderRadius, fontSizes, fontWeights],
  )

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setConfirmation('')
      setError(null)
    }
  }

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : tErrors('delete_failed'))
      return
    }
    // The account is gone server-side — clear the local session even if signOut errors
    try {
      await signOut()
    } catch {
      // session may already be invalid after deletion
    }
    router.replace('/(auth)/sign-in')
  }

  return (
    <AccountFormLayout title={tTabs('danger')} description={t('description')}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="alert" size="md" color={colors.destructive} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{t('delete_title')}</Text>
            <Text style={styles.cardDescription}>{t('delete_description')}</Text>
          </View>
        </View>

        <Button variant="danger" onPress={() => handleOpenChange(true)}>
          {t('delete')}
        </Button>
      </View>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('warning')}</AlertDialogDescription>
          </AlertDialogHeader>

          {isManagedOnMobile && (
            <View style={styles.iapWarning}>
              <Text style={styles.iapWarningText}>{t('iap_cancel_warning')}</Text>
            </View>
          )}

          <View style={styles.dialogBody}>
            <FormField
              label={t('confirm_label')}
              placeholder={t('confirm_placeholder')}
              value={confirmation}
              onChangeText={setConfirmation}
              autoComplete="off"
              autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => handleOpenChange(false)}>
              {tCommon('cancel')}
            </AlertDialogCancel>
            <Button
              variant="danger"
              size="sm"
              disabled={confirmation !== CONFIRM_PHRASE || isPending}
              loading={isPending}
              onPress={handleDelete}
            >
              {isPending ? t('deleting') : t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountFormLayout>
  )
}
