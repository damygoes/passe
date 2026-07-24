import { useDeleteTrip, useTrip } from '@passe/hooks'
import { formatTripDateFull } from '@passe/utils'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/ui/page-header'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'
import { TripExportMenu } from './TripExportMenu'

interface TripDetailHeaderProps {
  id: string
}

export function TripDetailHeader({ id }: TripDetailHeaderProps) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { data: trip, isLoading, isError } = useTrip(id)
  const deleteTrip = useDeleteTrip()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        headerText: { flex: 1, gap: spacing[1] },
        actions: { flexDirection: 'row', gap: spacing[2] },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] },
        cover: { width: '100%', aspectRatio: 16 / 9, borderRadius: borderRadius.xl },
        description: { fontSize: fontSizes.base, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  function handleDelete() {
    if (!trip) return
    setDeleteError(null)
    deleteTrip.mutate(trip.id, {
      onSuccess: () => router.replace('/(app)/trips'),
      onError: () => setDeleteError(t('delete_failed')),
    })
  }

  if (isLoading) return <TripDetailHeaderSkeleton />

  if (isError || !trip) return <ErrorBanner message={t('trip_error')} />

  return (
    <View style={styles.container}>
      <PageHeader>
        <View style={styles.headerText}>
          <PageHeaderTitle>{trip.title}</PageHeaderTitle>
          <PageHeaderDescription>
            {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
          </PageHeaderDescription>
        </View>
        <PageHeaderAction style={styles.actions}>
          <TripExportMenu tripId={id} onError={setExportError} />
          <Button
            variant="secondary"
            size="sm"
            onPress={() => router.push(`/(app)/trips/edit/${id}`)}
          >
            {t('edit')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onPress={() => setDeleteOpen(true)}
            accessibilityLabel={t('delete')}
          >
            <Icon name="delete" size="sm" color={colors.foreground} />
          </Button>
        </PageHeaderAction>
      </PageHeader>

      {deleteError && <ErrorBanner message={deleteError} />}
      {exportError && <ErrorBanner message={exportError} />}

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

      {trip.countries.length > 0 && (
        <View style={styles.badges}>
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </View>
      )}

      {trip.coverImageUrl && (
        <Image
          source={{ uri: trip.coverImageUrl }}
          style={styles.cover}
          contentFit="cover"
          accessibilityLabel={trip.title}
        />
      )}

      {trip.description && <Text style={styles.description}>{trip.description}</Text>}
    </View>
  )
}
