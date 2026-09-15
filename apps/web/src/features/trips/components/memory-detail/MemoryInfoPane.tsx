'use client'

import { Link } from '@/i18n/navigation'
import { memoryEditRoute, tripRoute } from '@/lib/routes'
import type { getPublicMemorySlots } from '@passe/auth/plan-gates'
import type { Memory } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'
import { Badge } from '@passe/ui/badge'
import { Button, buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { Switch } from '@passe/ui/switch'
import { formatCoordinates, formatMemoryDateTime } from '@passe/utils'
import { useTranslations } from 'next-intl'

interface Props {
  tripId: string
  trip: Trip | undefined
  memory: Memory
  slots: ReturnType<typeof getPublicMemorySlots> | null
  canPublish: boolean
  isPublicPending: boolean
  onTogglePublic: (checked: boolean) => void
  onAddPhotos: () => void
}

// The memory-level content: date/title/note/location/visibility/tags, plus
// the "Add photographs"/"Edit memory" footer. Deliberately never gains a
// per-photo control (caption, cover) — that boundary lives in
// ThisPhotographCard instead.
export function MemoryInfoPane({
  tripId,
  trip,
  memory,
  slots,
  canPublish,
  isPublicPending,
  onTogglePublic,
  onAddPhotos,
}: Props) {
  const t = useTranslations('trips.memory_card')
  const tDetail = useTranslations('trips.memory_detail')
  const placeLabel = memory.placeName ?? [memory.city, memory.country].filter(Boolean).join(', ')

  return (
    <div>
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
          disabled={!canPublish || isPublicPending}
          onCheckedChange={onTogglePublic}
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
        <Button type="button" variant="secondary" className="flex-1" onClick={onAddPhotos}>
          {tDetail('add_photographs')}
        </Button>
        <Link
          href={memoryEditRoute(tripId, memory.id)}
          className={buttonVariants({ variant: 'secondary', className: 'flex-1' })}
        >
          {t('edit')}
        </Link>
      </div>
    </div>
  )
}
