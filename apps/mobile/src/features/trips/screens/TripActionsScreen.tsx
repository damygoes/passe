import { useDeleteTrip } from '@passe/hooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'

// The ⋯ sheet for a trip: Export…, Edit, Delete. Presented as a formSheet
// (fitToContents) from the trip detail nav bar.
export function TripActionsScreen() {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const deleteTrip = useDeleteTrip()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: spacing[4],
          paddingTop: spacing[6],
          gap: spacing[1],
          backgroundColor: colors.background,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[3],
          borderRadius: borderRadius.lg,
        },
        rowPressed: { backgroundColor: colors.muted },
        rowLabel: { flex: 1, fontSize: fontSizes.base, color: colors.foreground },
        rowLabelDestructive: { color: colors.destructive },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  function handleDelete() {
    setDeleteError(null)
    deleteTrip.mutate(id, {
      onSuccess: () => {
        haptics.success()
        router.replace('/(app)/trips')
      },
      onError: () => setDeleteError(t('delete_failed')),
    })
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        {deleteError && <ErrorBanner message={deleteError} />}

        <Pressable
          onPress={() => router.replace(`/(app)/trips/export/${id}`)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          accessibilityRole="button"
        >
          <Icon name="share" size="md" color={colors.mutedForeground} />
          <Text style={styles.rowLabel}>{t('export_menu_trigger')}</Text>
          <Icon name="chevron-right" size="sm" color={colors.mutedForeground} />
        </Pressable>

        <Pressable
          onPress={() => router.replace(`/(app)/trips/edit/${id}`)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          accessibilityRole="button"
        >
          <Icon name="edit" size="md" color={colors.mutedForeground} />
          <Text style={styles.rowLabel}>{t('edit')}</Text>
        </Pressable>

        <Separator />

        <Pressable
          onPress={() => setDeleteOpen(true)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          accessibilityRole="button"
        >
          <Icon name="delete" size="md" color={colors.destructive} />
          <Text style={[styles.rowLabel, styles.rowLabelDestructive]}>{t('delete')}</Text>
        </Pressable>
      </View>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete_description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('delete_cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="danger"
              loading={deleteTrip.isPending}
              onPress={handleDelete}
            >
              {t('delete_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  )
}
