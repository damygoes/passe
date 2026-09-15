'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { memoryEditRoute, tripKeepsakesRoute, tripRoute } from '@/lib/routes'
import { getPublicMemorySlots } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useUpdateMemory, useUser } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { Skeleton } from '@passe/ui/skeleton'
import { Switch } from '@passe/ui/switch'
import { formatCoordinates, formatMemoryDateTime } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface Props {
  tripId: string
  memoryId: string
}

export function MemoryDetailView({ tripId, memoryId }: Props) {
  const t = useTranslations('trips.memory_card')
  const { data: trip } = useTrip(tripId)
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { data: user } = useUser()
  const updateMemory = useUpdateMemory()

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-[420px] w-full rounded-none lg:h-full" />
        <div className="p-11">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-2/3" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
      </div>
    )
  }

  const memory = memories?.find((item) => item.id === memoryId)
  if (isError || !memory) {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">{t('delete_failed')}</p>
      </div>
    )
  }

  const cover = memory.media[0]
  const otherPublicCount = memories.filter((m) => m.id !== memory.id && m.isPublic).length
  const slots = user ? getPublicMemorySlots(user.plan, otherPublicCount) : null
  const canPublish =
    memory.isPublic || (slots ? !slots.isUnlimited && (slots.remaining ?? 0) > 0 : true)
  const placeLabel = memory.placeName ?? [memory.city, memory.country].filter(Boolean).join(', ')

  return (
    <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
      <div className="washed relative min-h-[420px] bg-dark-espresso-dark p-5">
        {cover && (
          <div className="relative h-full w-full overflow-hidden rounded-[26px]">
            <Image
              src={cover.url}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 62vw"
              {...getBlurProps(cover.placeholder)}
            />
          </div>
        )}
      </div>

      <FadeIn className="overflow-auto p-11">
        {trip && (
          <Link
            href={tripRoute(tripId)}
            className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'pl-0' })}
          >
            <Icon name="chevron-left" size="xs" aria-hidden />
            {t('back', { title: trip.title })}
          </Link>
        )}

        <div className="mt-6 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {formatMemoryDateTime(memory.capturedAt)}
        </div>
        <h1 className="font-display mt-2 text-4xl leading-tight">{placeLabel}</h1>
        {memory.note && <p className="mt-4 text-[15.5px] leading-relaxed">{memory.note}</p>}

        {placeLabel && (
          <div className="mt-5 flex items-center gap-2.5 rounded-[20px] bg-popover p-4">
            <span className="size-2.5 shrink-0 rounded-full bg-terracotta" />
            <div>
              <div className="text-[13.5px]">{placeLabel}</div>
              {memory.location && (
                <div className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">
                  {formatCoordinates(memory.location.lat, memory.location.lng)}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-4 rounded-[20px] bg-popover p-4">
          <div>
            <div className="text-[13.5px]">{t('visible_on_public_page')}</div>
            {slots && (
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                {slots.isUnlimited
                  ? t('public_slots_unlimited')
                  : t('public_slots_limited', {
                      remaining: slots.remaining ?? 0,
                      limit: slots.limit ?? 0,
                    })}
              </div>
            )}
          </div>
          <Switch
            checked={memory.isPublic}
            disabled={!canPublish || updateMemory.isPending}
            onCheckedChange={(checked) =>
              updateMemory.mutate({ tripId, id: memory.id, isPublic: checked })
            }
          />
        </div>

        {memory.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {memory.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-2.5">
          <Link
            href={tripKeepsakesRoute(tripId)}
            className={buttonVariants({ variant: 'secondary', className: 'flex-1' })}
          >
            {t('make_postcard')}
          </Link>
          <Link
            href={memoryEditRoute(tripId, memory.id)}
            className={buttonVariants({ variant: 'secondary', className: 'flex-1' })}
          >
            {t('edit')}
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
