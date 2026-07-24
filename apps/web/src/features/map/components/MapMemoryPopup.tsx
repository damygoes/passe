'use client'

import type { MapPoint } from '@passe/types/memory'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { tripRoute } from '@/lib/routes'

interface MapMemoryPopupProps {
  point: MapPoint
  onClose: () => void
}

export function MapMemoryPopup({ point, onClose }: MapMemoryPopupProps) {
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
      <div className="flex justify-end border-t p-3 pt-2">
        <Button variant="default" size="sm" onClick={() => router.push(tripRoute(point.tripId))}>
          {t('view_trip')}
        </Button>
      </div>
    </div>
  )
}
