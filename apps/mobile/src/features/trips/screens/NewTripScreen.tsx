import { canCreateTrip, canMakePortfolioPublic } from '@passe/auth/plan-gates'
import { useCreateTrip, useTrips, useUser } from '@passe/hooks'
import type { CreateTrip } from '@passe/types/trip'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { CountryTagsInput } from '@/features/trips/components/CountryTagsInput'
import { DateField } from '@/features/trips/components/DateField'
import { createTripSchema, type TripFormValues } from '@/features/trips/schemas/trip'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function NewTripScreen() {
  const t = useTranslations('trips.new')
  const tValidation = useTranslations('trips.new.validation')
  const router = useRouter()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const { data: user } = useUser()
  const { data: trips = [] } = useTrips()
  const { mutateAsync, isPending } = useCreateTrip()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const plan = user?.plan ?? 'free'
  const atTripLimit = !canCreateTrip(plan, trips.length)
  const canPublish = canMakePortfolioPublic(plan)

  const TripSchema = useMemo(() => createTripSchema(tValidation), [tValidation])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(TripSchema),
    defaultValues: { title: '', description: '', countries: [], isPublic: false },
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
      const trip = await mutateAsync(data as CreateTrip)
      router.replace(`/(app)/trips/${trip.id}`)
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : t('validation.create_failed'))
    }
  }

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
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
                  {canPublish ? t('public_hint') : t('public_gated_hint')}
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
          {isPending ? t('creating') : t('create')}
        </Button>
      </View>
    </AccountFormLayout>
  )
}
