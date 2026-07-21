'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { routes, tripEditRoute } from '@/lib/routes'
import { canExportPdf } from '@passe/auth/plan-gates'
import { useDeleteTrip, useTrip, useUser } from '@passe/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@passe/ui/alert-dialog'
import { Badge } from '@passe/ui/badge'
import { Button, buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@passe/ui/page-header'
import { formatTripDateFull } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'
import { TripExportMenu } from './TripExportMenu'

interface Props {
  id: string
}

export function TripDetailHeader({ id }: Props) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { data: trip, isLoading, isError } = useTrip(id)
  const { data: user } = useUser()
  const deleteTrip = useDeleteTrip()
  const canDownloadPdf = canExportPdf(user?.plan ?? 'free')
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight)
    }
  }, [trip?.coverImageUrl])

  async function handleDelete() {
    if (!trip) return
    setDeleteError(null)
    try {
      await deleteTrip.mutateAsync(trip.id)
      router.push(routes.dashboard)
    } catch {
      setDeleteError(t('delete_failed'))
    }
  }

  if (isLoading) return <TripDetailHeaderSkeleton />

  if (isError) return <p className="text-sm text-destructive">{t('trip_error')}</p>

  if (!trip) return <p className="text-sm text-destructive">{t('trip_error')}</p>

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>{trip.title}</PageHeaderTitle>
        <PageHeaderDescription>
          {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
        </PageHeaderDescription>
        <PageHeaderAction className="flex items-center gap-2">
          <Link
            href={routes.dashboard}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {t('back')}
          </Link>
          <Link
            href={tripEditRoute(trip.id)}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            {t('edit')}
          </Link>
          <TripExportMenu tripId={trip.id} canExport={canDownloadPdf} />
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger
              render={<Button variant="destructive" size="icon-sm" aria-label={t('delete')} />}
            >
              <Icon name="delete" size="sm" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
                <AlertDialogDescription>{t('delete_description')}</AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError && <p className="px-1 text-sm text-destructive">{deleteError}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
                  {t('delete_cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteTrip.isPending}
                  isLoading={deleteTrip.isPending}
                  onClick={handleDelete}
                >
                  {t('delete_confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PageHeaderAction>
      </PageHeader>

      {trip.countries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </div>
      )}

      {trip.coverImageUrl && (
        <div
          className="relative mx-auto mt-6 max-w-full overflow-hidden rounded-xl bg-muted"
          style={{
            height: 'min(70vh, 40rem)',
            aspectRatio: aspectRatio ?? undefined,
            width: aspectRatio ? 'auto' : '100%',
          }}
        >
          <Image
            ref={imgRef}
            src={trip.coverImageUrl}
            alt={`Cover photo for ${trip.title}`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
            onLoad={(event) => {
              const img = event.currentTarget
              if (img.naturalWidth && img.naturalHeight) {
                setAspectRatio(img.naturalWidth / img.naturalHeight)
              }
            }}
          />
        </div>
      )}

      {trip.description && <p className="mt-4 text-muted-foreground">{trip.description}</p>}
    </>
  )
}
