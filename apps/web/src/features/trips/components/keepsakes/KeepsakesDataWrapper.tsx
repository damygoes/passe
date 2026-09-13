'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { canExportPdf } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useUser } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { Button, buttonVariants } from '@passe/ui/button'
import { Skeleton } from '@passe/ui/skeleton'
import { cn, formatDateRange } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PostcardExportSheet } from '../trip/trip-detail/PostcardExportSheet'
import { ZineExportSheet } from '../trip/trip-detail/ZineExportSheet'

interface Props {
  tripId: string
}

interface ExportCardProps {
  title: string
  description: string
  ctaLabel: string
  lockedLabel: string
  canExport: boolean
  /** A direct download link (PDF); mutually exclusive with `onExport`. */
  href?: string
  /** Opens the picker sheet (zine/postcard); mutually exclusive with `href`. */
  onExport?: () => void
}

function ExportCard({
  title,
  description,
  ctaLabel,
  lockedLabel,
  canExport,
  href,
  onExport,
}: ExportCardProps) {
  return (
    <div className="flex flex-col rounded-[32px] bg-popover p-6 shadow-sm">
      <div className="washed h-[250px] rounded-[22px] bg-secondary" />
      <h3 className="font-display mt-[18px] text-[27px]">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      {canExport ? (
        href ? (
          <a href={href} className={cn(buttonVariants(), 'mt-[18px] h-11 w-full')}>
            {ctaLabel}
          </a>
        ) : (
          <Button onClick={onExport} className="mt-[18px] h-11 w-full">
            {ctaLabel}
          </Button>
        )
      ) : (
        <Link
          href={routes.billing}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-[18px] h-11 w-full')}
        >
          {lockedLabel}
        </Link>
      )}
    </div>
  )
}

export function KeepsakesDataWrapper({ tripId }: Props) {
  const t = useTranslations('trips.keepsakes')
  const tDetail = useTranslations('trips.detail')
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(tripId)
  const { data: memories = [], isLoading: memoriesLoading } = useMemories(tripId)
  const { data: user } = useUser()

  const [zineSheetOpen, setZineSheetOpen] = useState(false)
  const [postcardSheetOpen, setPostcardSheetOpen] = useState(false)

  if (tripLoading || memoriesLoading) {
    return (
      <div className="flex flex-col gap-9">
        <Skeleton className="h-14 w-96" />
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
          <Skeleton className="h-[420px] rounded-[32px]" />
          <Skeleton className="h-[420px] rounded-[32px]" />
          <Skeleton className="h-[420px] rounded-[32px]" />
        </div>
      </div>
    )
  }

  if (tripError || !trip) {
    return <p className="text-sm text-destructive">{t('load_error')}</p>
  }

  const canExport = user ? canExportPdf(user.plan) : false

  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <p className="mt-2 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
            {trip.title} · {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
            {t('memories_count', { count: memories.length })}
          </p>
        </div>
        <Badge variant={canExport ? 'shared' : 'neutral'} className="font-mono uppercase">
          {canExport ? t('badge_unlocked') : t('badge_locked')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        <ExportCard
          title={t('pdf_title')}
          description={tDetail('export_pdf_description')}
          ctaLabel={t('pdf_cta')}
          lockedLabel={t('locked_cta')}
          canExport={canExport}
          href={`/api/trips/${tripId}/pdf`}
        />
        <ExportCard
          title={t('zine_title')}
          description={tDetail('export_zine_description')}
          ctaLabel={t('zine_cta')}
          lockedLabel={t('locked_cta')}
          canExport={canExport}
          onExport={() => setZineSheetOpen(true)}
        />
        <ExportCard
          title={t('postcard_title')}
          description={tDetail('export_postcard_description')}
          ctaLabel={t('postcard_cta')}
          lockedLabel={t('locked_cta')}
          canExport={canExport}
          onExport={() => setPostcardSheetOpen(true)}
        />
      </div>

      <ZineExportSheet tripId={tripId} open={zineSheetOpen} onOpenChange={setZineSheetOpen} />
      <PostcardExportSheet
        tripId={tripId}
        open={postcardSheetOpen}
        onOpenChange={setPostcardSheetOpen}
      />
    </div>
  )
}
