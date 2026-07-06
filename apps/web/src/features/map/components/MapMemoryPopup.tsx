'use client'

import type { MapPoint } from '@passe/types/memory'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { tripRoute } from '@/lib/routes'

interface MapMemoryPopupProps {
  point: MapPoint
}

export function MapMemoryPopup({ point }: MapMemoryPopupProps) {
  const t = useTranslations('map')

  return (
    <div className="flex w-48 flex-col gap-2">
      {point.thumbnailUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={point.thumbnailUrl} alt="" fill className="object-cover" sizes="192px" />
        </div>
      )}
      {(point.city || point.country) && (
        <p className="text-xs font-medium text-muted-foreground">
          {[point.city, point.country].filter(Boolean).join(', ')}
        </p>
      )}
      {point.note && <p className="text-sm line-clamp-3">{point.note}</p>}
      <Link href={tripRoute(point.tripId)} className="text-sm font-medium text-primary underline">
        {t('view_trip')}
      </Link>
    </div>
  )
}
