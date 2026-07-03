'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { canCreateTrip, canMakePortfolioPublic } from '@passe/auth/plan-gates'
import { useCreateTrip, useTrips, useUser } from '@passe/hooks'
import { CreateTripFormSchema, type CreateTrip } from '@passe/types/trip'
import { Button } from '@passe/ui/button'
import { DatePicker } from '@passe/ui/date-picker'
import { Input } from '@passe/ui/input'
import { Switch } from '@passe/ui/switch'
import { Textarea } from '@passe/ui/textarea'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Link, useRouter } from '@/i18n/navigation'
import { routes, tripRoute } from '@/lib/routes'
import { CountryTagsInput } from './CountryTagsInput'

export function NewTripForm() {
  const t = useTranslations('trips.new')
  const router = useRouter()
  const { data: user } = useUser()
  const { data: trips = [] } = useTrips()
  const { mutateAsync, isPending } = useCreateTrip()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const plan = user?.plan ?? 'free'
  const atTripLimit = !canCreateTrip(plan, trips.length)
  const canPublish = canMakePortfolioPublic(plan)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateTrip>({
    resolver: zodResolver(CreateTripFormSchema) as Resolver<CreateTrip>,
    defaultValues: {
      title: '',
      description: '',
      countries: [],
      isPublic: false,
    },
  })

  const startDate = watch('startDate')

  const onSubmit = async (data: CreateTrip) => {
    setGlobalError(null)
    try {
      const trip = await mutateAsync(data)
      router.push(tripRoute(trip.id))
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : t('errors.create_failed'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {globalError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {globalError}
        </div>
      )}

      {atTripLimit && (
        <div
          role="alert"
          className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        >
          {t('limit_reached')}{' '}
          <Link href={routes.billing} className="font-medium text-primary hover:underline">
            {t('upgrade_cta')}
          </Link>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          {t('title_label')}
        </label>
        <Input
          id="title"
          type="text"
          placeholder={t('title_placeholder')}
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          {t('description_label')}
        </label>
        <Textarea
          id="description"
          rows={3}
          placeholder={t('description_placeholder')}
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="countries" className="text-sm font-medium text-foreground">
          {t('countries_label')}
        </label>
        <Controller
          control={control}
          name="countries"
          render={({ field }) => (
            <CountryTagsInput
              id="countries"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t('countries_placeholder')}
              removeLabel={t('remove_country')}
              aria-invalid={!!errors.countries}
            />
          )}
        />
        {errors.countries && (
          <p className="text-xs text-destructive">{t('errors.countries_required')}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="startDate" className="text-sm font-medium text-foreground">
            {t('start_date_label')}
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                id="startDate"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('date_placeholder')}
                aria-invalid={!!errors.startDate}
              />
            )}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="endDate" className="text-sm font-medium text-foreground">
            {t('end_date_label')}
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                id="endDate"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('date_placeholder')}
                fromDate={startDate}
                aria-invalid={!!errors.endDate}
              />
            )}
          />
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
        </div>
      </div>

      <Controller
        control={control}
        name="isPublic"
        render={({ field }) => (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
                {t('public_label')}
              </label>
              <p className="text-xs text-muted-foreground">
                {canPublish ? t('public_hint') : t('public_gated_hint')}
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={!canPublish}
            />
          </div>
        )}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={isPending || atTripLimit} isLoading={isPending}>
          {isPending ? t('creating') : t('create')}
        </Button>
        <Link
          href={routes.dashboard}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t('cancel')}
        </Link>
      </div>
    </form>
  )
}
