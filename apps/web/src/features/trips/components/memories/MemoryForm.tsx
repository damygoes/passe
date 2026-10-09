'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { canAddMemory } from '@passe/auth/plan-gates'
import {
  useCreateMemory,
  useMemories,
  useReverseGeocode,
  useTrip,
  useUpdateMemory,
  useUser,
} from '@passe/hooks'
import { CreateMemorySchema, type Coordinates, type Memory } from '@passe/types/memory'
import { Button } from '@passe/ui/button'
import { DatePicker } from '@passe/ui/date-picker'
import { Icon } from '@passe/ui/icon'
import { Input } from '@passe/ui/input'
import { Switch } from '@passe/ui/switch'
import { Textarea } from '@passe/ui/textarea'
import { formatTripDate } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { Link, useRouter } from '@/i18n/navigation'
import { billingRoute, tripRoute } from '@/lib/routes'
import { MemoryPhotosField, type MemoryPhoto } from './MemoryPhotosField'

const MemoryFormFieldsSchema = CreateMemorySchema.pick({
  note: true,
  capturedAt: true,
  city: true,
  country: true,
  placeName: true,
})

type MemoryFormFields = z.infer<typeof MemoryFormFieldsSchema>

interface Props {
  tripId: string
  // When provided, the form edits this memory; otherwise it creates a new one.
  memory?: Memory
}

export function MemoryForm({ tripId, memory }: Props) {
  const t = useTranslations('trips.new_memory')
  const tEdit = useTranslations('trips.edit_memory')
  const router = useRouter()
  const { data: user } = useUser()
  const { data: trip } = useTrip(tripId)
  const { data: memories = [] } = useMemories(tripId)
  const { mutateAsync: createMemory, isPending: isCreating } = useCreateMemory()
  const { mutateAsync: updateMemory, isPending: isUpdating } = useUpdateMemory()
  const reverseGeocode = useReverseGeocode()
  const [photos, setPhotos] = useState<MemoryPhoto[]>(
    () =>
      // Existing photos are already resolved, renderable URLs from the GET
      // response — url and previewUri are the same value here; only a fresh
      // upload in this session needs a distinct local object-URL preview.
      memory?.media.map((item) => ({
        url: item.url,
        previewUri: item.url,
        width: item.width ?? null,
        height: item.height ?? null,
      })) ?? [],
  )
  const [coords, setCoords] = useState<Coordinates | null>(memory?.location ?? null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  // Defaults to private, per the redesign's privacy-first spec — the create
  // API also hardcodes isPublic: false, this is purely the user-facing toggle.
  const [isPublic, setIsPublic] = useState(memory?.isPublic ?? false)
  const [tagsInput, setTagsInput] = useState(memory?.tags.join(', ') ?? '')

  const isEditing = Boolean(memory)
  const isPending = isCreating || isUpdating
  const plan = user?.plan ?? 'free'
  const atMemoryLimit = !isEditing && !canAddMemory(plan, memories.length)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MemoryFormFields>({
    resolver: zodResolver(MemoryFormFieldsSchema) as Resolver<MemoryFormFields>,
    defaultValues: memory
      ? {
          note: memory.note ?? '',
          capturedAt: memory.capturedAt,
          city: memory.city ?? '',
          country: memory.country ?? '',
          placeName: memory.placeName ?? '',
        }
      : { note: '', capturedAt: new Date(), city: '', country: '', placeName: '' },
  })

  const handleUseLocation = async () => {
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError(t('location_permission_denied'))
      return
    }

    setIsLocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      )
      const nextCoords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      setCoords(nextCoords)

      const place = await reverseGeocode.mutateAsync(nextCoords)
      if (place.city) setValue('city', place.city)
      if (place.country) setValue('country', place.country)
      if (place.placeName) setValue('placeName', place.placeName)
    } catch {
      setLocationError(t('location_permission_denied'))
    } finally {
      setIsLocating(false)
    }
  }

  const onSubmit = async (data: MemoryFormFields) => {
    setGlobalError(null)

    const note = data.note?.trim()
    if (!note && photos.length === 0) {
      setContentError(t('errors.content_required'))
      return
    }
    setContentError(null)

    const media = photos.map((photo) => ({
      url: photo.url,
      mediaType: 'photo' as const,
      width: photo.width,
      height: photo.height,
    }))
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    try {
      if (memory) {
        await updateMemory({
          id: memory.id,
          tripId,
          note: note || undefined,
          capturedAt: data.capturedAt,
          city: data.city?.trim() || undefined,
          country: data.country?.trim() || undefined,
          placeName: data.placeName?.trim() || undefined,
          tags,
          isPublic,
          location: coords,
          media,
        })
      } else {
        await createMemory({
          tripId,
          note: note || undefined,
          capturedAt: data.capturedAt,
          city: data.city?.trim() || undefined,
          country: data.country?.trim() || undefined,
          placeName: data.placeName?.trim() || undefined,
          tags,
          location: coords,
          isPublic,
          media,
        })
      }
      router.push(tripRoute(tripId))
    } catch (err) {
      const fallback = isEditing ? tEdit('update_failed') : t('errors.create_failed')
      setGlobalError(err instanceof Error ? err.message : fallback)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 sm:grid-cols-2" noValidate>
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

      <div className="flex flex-col gap-5">
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
            <Link
              href={billingRoute('memories')}
              className="font-medium text-primary hover:underline"
            >
              {t('upgrade_cta')}
            </Link>
          </div>
        )}

        {trip && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('trip_label')}</label>
            <div className="input flex h-10 items-center rounded-full border border-input bg-transparent px-4 text-sm text-muted-foreground">
              {trip.title} · {formatTripDate(trip.startDate)}
            </div>
          </div>
        )}

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

        <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="placeName" className="text-sm font-medium text-foreground">
              {t('place_name_label')}
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUseLocation}
              disabled={isPending || isLocating}
            >
              <Icon name="location" size="sm" />
              {isLocating ? t('locating') : t('use_current_location')}
            </Button>
          </div>
          <Input
            id="placeName"
            type="text"
            placeholder={t('place_name_placeholder')}
            aria-invalid={!!errors.placeName}
            {...register('placeName')}
          />
          {locationError && <p className="text-xs text-destructive">{locationError}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tags" className="text-sm font-medium text-foreground">
            {t('tags_label')}
          </label>
          <Input
            id="tags"
            type="text"
            placeholder={t('tags_placeholder')}
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 rounded-[22px] bg-deep-olive/12 p-4">
          <div className="flex-1">
            <div className="text-sm text-deep-olive-dark">{t('privacy_title')}</div>
            <div className="mt-0.5 text-xs text-deep-olive-dark/85">{t('privacy_description')}</div>
          </div>
          <Switch checked={!isPublic} onCheckedChange={(checked) => setIsPublic(!checked)} />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={isPending || atMemoryLimit} isLoading={isPending}>
            {isEditing
              ? isPending
                ? tEdit('saving')
                : tEdit('save')
              : isPending
                ? t('creating')
                : trip
                  ? t('save_to_trip', { tripTitle: trip.title })
                  : t('create')}
          </Button>
          <Link
            href={tripRoute(tripId)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('cancel')}
          </Link>
        </div>
      </div>
    </form>
  )
}
