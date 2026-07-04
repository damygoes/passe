'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { canAddMemory } from '@passe/auth/plan-gates'
import { useCreateMemory, useMemories, useUser, type UploadedImage } from '@passe/hooks'
import { CreateMemorySchema } from '@passe/types/memory'
import { Button } from '@passe/ui/button'
import { DatePicker } from '@passe/ui/date-picker'
import { Input } from '@passe/ui/input'
import { Textarea } from '@passe/ui/textarea'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { Link, useRouter } from '@/i18n/navigation'
import { routes, tripRoute } from '@/lib/routes'
import { MemoryPhotosField } from './MemoryPhotosField'

const MemoryFormFieldsSchema = CreateMemorySchema.pick({
  note: true,
  capturedAt: true,
  city: true,
  country: true,
})

type MemoryFormFields = z.infer<typeof MemoryFormFieldsSchema>

interface Props {
  tripId: string
}

export function NewMemoryForm({ tripId }: Props) {
  const t = useTranslations('trips.new_memory')
  const router = useRouter()
  const { data: user } = useUser()
  const { data: memories = [] } = useMemories(tripId)
  const { mutateAsync: createMemory, isPending } = useCreateMemory()
  const [photos, setPhotos] = useState<UploadedImage[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)

  const plan = user?.plan ?? 'free'
  const atMemoryLimit = !canAddMemory(plan, memories.length)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MemoryFormFields>({
    resolver: zodResolver(MemoryFormFieldsSchema) as Resolver<MemoryFormFields>,
    defaultValues: { note: '', capturedAt: new Date(), city: '', country: '' },
  })

  const onSubmit = async (data: MemoryFormFields) => {
    setGlobalError(null)

    const note = data.note?.trim()
    if (!note && photos.length === 0) {
      setContentError(t('errors.content_required'))
      return
    }
    setContentError(null)

    try {
      await createMemory({
        tripId,
        note: note || undefined,
        capturedAt: data.capturedAt,
        city: data.city?.trim() || undefined,
        country: data.country?.trim() || undefined,
        isPublic: false,
        media: photos.map((photo) => ({
          url: photo.url,
          mediaType: 'photo' as const,
          width: photo.width,
          height: photo.height,
        })),
      })
      router.push(tripRoute(tripId))
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

      {atMemoryLimit && (
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
        <label htmlFor="photos" className="text-sm font-medium text-foreground">
          {t('photos_label')}
        </label>
        <MemoryPhotosField
          id="photos"
          photos={photos}
          onAdd={(photo) => {
            setContentError(null)
            setPhotos((current) => [...current, photo])
          }}
          onRemove={(index) => setPhotos((current) => current.filter((_, i) => i !== index))}
          disabled={isPending || atMemoryLimit}
        />
        {contentError && <p className="text-xs text-destructive">{contentError}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note" className="text-sm font-medium text-foreground">
          {t('note_label')}
        </label>
        <Textarea
          id="note"
          rows={4}
          placeholder={t('note_placeholder')}
          aria-invalid={!!errors.note}
          {...register('note')}
        />
        {errors.note && <p className="text-xs text-destructive">{errors.note.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="capturedAt" className="text-sm font-medium text-foreground">
          {t('date_label')}
        </label>
        <Controller
          control={control}
          name="capturedAt"
          render={({ field }) => (
            <DatePicker
              id="capturedAt"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('date_label')}
              aria-invalid={!!errors.capturedAt}
            />
          )}
        />
        {errors.capturedAt && (
          <p className="text-xs text-destructive">{errors.capturedAt.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="city" className="text-sm font-medium text-foreground">
            {t('city_label')}
          </label>
          <Input
            id="city"
            type="text"
            placeholder={t('city_placeholder')}
            aria-invalid={!!errors.city}
            {...register('city')}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="country" className="text-sm font-medium text-foreground">
            {t('country_label')}
          </label>
          <Input
            id="country"
            type="text"
            placeholder={t('country_placeholder')}
            aria-invalid={!!errors.country}
            {...register('country')}
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={isPending || atMemoryLimit} isLoading={isPending}>
          {isPending ? t('creating') : t('create')}
        </Button>
        <Link
          href={tripRoute(tripId)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t('cancel')}
        </Link>
      </div>
    </form>
  )
}
