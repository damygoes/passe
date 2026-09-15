'use client'

import type { MapPoint } from '@passe/types/memory'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { tripRoute } from '@/lib/routes'

interface MapMemoryPopupPager {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}

interface MapMemoryPopupProps {
  point: MapPoint
  onClose: () => void
  pager?: MapMemoryPopupPager
}

export function MapMemoryPopup({ point, onClose, pager }: MapMemoryPopupProps) {
  const t = useTranslations('map')
  const router = useRouter()

  const location = [point.city, point.country].filter(Boolean).join(', ')

  return (
    <div className="w-56 overflow-hidden rounded-xl border bg-popover shadow-lg">
      <div className="relative">
        {point.thumbnailUrl && (
          <div className="relative aspect-video w-full">
            <Image
              src={point.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              sizes="224px"
              {...getBlurProps(point.thumbnailPlaceholder)}
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 bg-popover hover:bg-popover"
          onClick={onClose}
          aria-label={t('close')}
        >
          <Icon name="close" size="sm" />
        </Button>
      </div>
      <div className="flex flex-col gap-1 p-3">
        {location.length > 0 && (
          <p className="text-xs font-medium text-muted-foreground">{location}</p>
        )}
        {point.note && <p className="line-clamp-3 text-sm">{point.note}</p>}
      </div>
      {pager && (
        <div className="flex items-center justify-between border-t px-3 py-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={pager.onPrev}
            disabled={pager.index === 0}
            aria-label={t('prev_photo')}
          >
            <Icon name="chevron-left" size="sm" />
          </Button>
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
            {pager.index + 1} / {pager.total}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={pager.onNext}
            disabled={pager.index === pager.total - 1}
            aria-label={t('next_photo')}
          >
            <Icon name="chevron-right" size="sm" />
          </Button>
        </div>
      )}
      <div className="flex justify-end border-t p-3 pt-2">
        <Button variant="default" size="sm" onClick={() => router.push(tripRoute(point.tripId))}>
          {t('view_trip')}
        </Button>
      </div>
    </div>
  )
}
