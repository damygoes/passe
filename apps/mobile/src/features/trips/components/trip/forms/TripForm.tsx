import { canCreateTrip, canMakePortfolioPublic } from '@passe/auth/plan-gates'
import { useCreateTrip, useTrips, useUpdateTrip, useUser } from '@passe/hooks'
import type { CreateTrip, Trip, UpdateTrip } from '@passe/types/trip'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { StyleSheet, Switch, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { CountryTagsInput } from '@/features/trips/components/trip/country-tags/CountryTagsInput'
import { CoverImagePicker } from '@/features/trips/components/trip/image-upload/CoverImagePicker'
import { DateField } from '@/features/trips/components/trip/date-field/DateField'
import { createTripSchema, type TripFormValues } from '@/features/trips/schemas/trip'
import { useTheme } from '@/hooks/useTheme'
import { haptics } from '@/lib/haptics'
import { useTranslations } from '@/i18n/useTranslations'

interface TripFormProps {
  // When provided, the form edits this trip; otherwise it creates a new one.
  trip?: Trip
}

export function TripForm({ trip }: TripFormProps) {
  const t = useTranslations('trips.new')
  const tEdit = useTranslations('trips.edit')
  const tValidation = useTranslations('trips.new.validation')
  const router = useRouter()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const { data: user } = useUser()
  const { data: trips = [] } = useTrips()
  const { mutateAsync: createTrip, isPending: isCreating } = useCreateTrip()
  const { mutateAsync: updateTrip, isPending: isUpdating } = useUpdateTrip()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const isEditing = Boolean(trip)
  const isPending = isCreating || isUpdating

  const plan = user?.plan ?? 'free'
  const atTripLimit = !isEditing && !canCreateTrip(plan, trips.length)
  const canPublish = canMakePortfolioPublic(plan)

  const TripSchema = useMemo(() => createTripSchema(tValidation), [tValidation])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(TripSchema),
    defaultValues: trip
      ? {
          title: trip.title,
          description: trip.description ?? '',
          coverImageUrl: trip.coverImageUrl ?? null,
          countries: trip.countries,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
          isPublic: trip.isPublic,
        }
      : { title: '', description: '', coverImageUrl: null, countries: [], isPublic: false },
  })

  const startDate = useWatch({ control, name: 'startDate' })

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: spacing[4] },
        fieldLabel: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.foreground },
        fieldGroup: { gap: spacing[2] },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
        publicRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing[4],
        },
        publicTextGroup: { flex: 1, gap: spacing[1] },
        publicHint: { fontSize: fontSizes.xs, color: colors.mutedForeground },
        limitBanner: {
          gap: spacing[1],
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.muted,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
        },
        limitText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  const onSubmit = async (data: TripFormValues) => {
    setGlobalError(null)
    try {
      if (trip) {
        await updateTrip({ id: trip.id, ...(data as UpdateTrip) })
        haptics.success()
        router.replace(`/(app)/trips/${trip.id}`)
      } else {
        const created = await createTrip(data as CreateTrip)
        haptics.success()
        router.replace(`/(app)/trips/${created.id}`)
      }
    } catch (err) {
      const fallback = isEditing ? tEdit('update_failed') : t('validation.create_failed')
      setGlobalError(err instanceof Error ? err.message : fallback)
    }
  }

  return (
    <View style={styles.form}>
      {globalError && <ErrorBanner message={globalError} />}
      {atTripLimit && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>{t('limit_reached')}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <FormField
            label={t('title_label')}
            placeholder={t('title_placeholder')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormField
            label={t('description_label')}
            placeholder={t('description_placeholder')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            multiline
            numberOfLines={3}
            error={errors.description?.message}
          />
        )}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t('cover_label')}</Text>
        <Controller
          control={control}
          name="coverImageUrl"
          render={({ field }) => (
            <CoverImagePicker value={field.value} onChange={field.onChange} disabled={isPending} />
          )}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t('countries_label')}</Text>
        <Controller
          control={control}
          name="countries"
          render={({ field }) => (
            <CountryTagsInput
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t('countries_placeholder')}
              removeLabel={t('remove_country')}
            />
          )}
        />
        {errors.countries && <Text style={styles.errorText}>{errors.countries.message}</Text>}
      </View>

      <Controller
        control={control}
        name="startDate"
        render={({ field }) => (
          <DateField
            label={t('start_date_label')}
            value={field.value}
            onChange={field.onChange}
            placeholder={t('date_placeholder')}
            doneLabel={t('date_done')}
            error={errors.startDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="endDate"
        render={({ field }) => (
          <DateField
            label={t('end_date_label')}
            value={field.value}
            onChange={field.onChange}
            placeholder={t('date_placeholder')}
            doneLabel={t('date_done')}
            minimumDate={startDate}
            error={errors.endDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="isPublic"
        render={({ field }) => (
          <View style={styles.publicRow}>
            <View style={styles.publicTextGroup}>
              <Text style={styles.fieldLabel}>{t('public_label')}</Text>
              <Text style={styles.publicHint}>
                {canPublish ? t('public_hint') : t('public_gated_hint_locked')}
              </Text>
            </View>
            <Switch
              value={field.value ?? false}
              onValueChange={field.onChange}
              disabled={!canPublish}
              trackColor={{ true: colors.primary }}
            />
          </View>
        )}
      />

      <Button
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
        disabled={isPending || atTripLimit}
        fullWidth
      >
        {isEditing
          ? isPending
            ? tEdit('saving')
            : tEdit('save')
          : isPending
            ? t('creating')
            : t('create')}
      </Button>
    </View>
  )
}
