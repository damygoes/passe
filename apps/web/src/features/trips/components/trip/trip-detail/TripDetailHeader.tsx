'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { publicTripRoute, routes, tripEditRoute, tripNewMemoryRoute } from '@/lib/routes'
import { useDeleteTrip, useMemories, useTrip, useUser } from '@passe/hooks'
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
import { formatDateRange, getUniqueCities } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'

interface Props {
  id: string
}

export function TripDetailHeader({ id }: Props) {
  const t = useTranslations('trips.detail')
  const tHome = useTranslations('trips.home')
  const router = useRouter()
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(id)
  const { data: memories = [], isLoading: memoriesLoading } = useMemories(id)
  const { data: user } = useUser()
  const deleteTrip = useDeleteTrip()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  if (tripLoading || memoriesLoading) return <TripDetailHeaderSkeleton />
  if (tripError || !trip) return <p className="text-sm text-destructive">{t('trip_error')}</p>

  const { uniqueCities } = getUniqueCities({ allMemories: memories })
  const isShared = memories.some((memory) => memory.isPublic)

  return (
    <div>
      <div className="washed relative h-[380px] w-full overflow-hidden rounded-[34px]">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        ) : (
          <div className="from-sandy-beige via-aged-cream to-terracotta/30 h-full w-full bg-gradient-to-br" />
        )}
      </div>

      <div className="relative -mt-[70px] mx-6 flex flex-wrap items-end gap-8 rounded-[34px] bg-popover p-9 shadow-md">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            {formatDateRange(trip.startDate, trip.endDate)}
          </div>
          <h1 className="font-display mt-2 text-5xl leading-none sm:text-6xl">{trip.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...uniqueCities].map((city) => (
              <Badge key={city} variant="private">
                {city}
              </Badge>
            ))}
            <Badge variant="neutral">
              {memories.length} {t('memories_heading', { count: memories.length })}
            </Badge>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:w-[220px]">
          <Link href={tripNewMemoryRoute(trip.id)} className={buttonVariants()}>
            {t('add_memory')}
          </Link>
          <Link
            href={user?.username ? publicTripRoute(user.username, trip.id) : routes.account}
            className={buttonVariants({ variant: 'secondary' })}
          >
            {t('share')}
          </Link>
          <div className="flex items-center justify-center gap-2 font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground uppercase">
            <span
              className={`size-1.5 rounded-full ${isShared ? 'bg-terracotta' : 'bg-deep-olive'}`}
            />
            {isShared ? tHome('shared_tag') : tHome('private_tag')}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Link
              href={tripEditRoute(trip.id)}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              <Icon name="edit" size="sm" />
              {t('edit')}
            </Link>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={t('delete')} />}
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
          </div>
        </div>
      </div>
    </div>
  )
}
