'use client'

import { Link } from '@/i18n/navigation'
import { billingRoute } from '@/lib/routes'
import { canExportPdf, type GatedFeature } from '@passe/auth/plan-gates'
import { useUser } from '@passe/hooks'
import { Badge } from '@passe/ui/badge'
import { Button, buttonVariants } from '@passe/ui/button'
import { Icon, type IconName } from '@passe/ui/icon'
import { Skeleton } from '@passe/ui/skeleton'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PostcardExportSheet } from '../trip/trip-detail/PostcardExportSheet'
import { ZineExportSheet } from '../trip/trip-detail/ZineExportSheet'

interface Props {
  tripId: string
}

interface ExportCardProps {
  icon: IconName
  title: string
  description: string
  ctaLabel: string
  lockedLabel: string
  statusLabel: string
  canExport: boolean
  /** Which keepsake this card is, so the locked CTA can tell the paywall what to feature. */
  reason: GatedFeature
  /** A direct download link (PDF); mutually exclusive with `onExport`. */
  href?: string
  /** Opens the picker sheet (zine/postcard); mutually exclusive with `href`. */
  onExport?: () => void
}

function ExportCard({
  icon,
  title,
  description,
  ctaLabel,
  lockedLabel,
  statusLabel,
  canExport,
  reason,
  href,
  onExport,
}: ExportCardProps) {
  return (
    <div className="flex flex-col rounded-[32px] bg-popover p-6 shadow-sm">
      <div className="washed flex h-[250px] items-center justify-center rounded-[22px] bg-secondary">
        <Icon name={icon} size="3xl" className="text-dark-espresso/25" aria-hidden />
      </div>
      <div className="mt-[18px] flex items-center gap-2">
        <h3 className="font-display text-[27px]">{title}</h3>
        <Badge variant={canExport ? 'neutral' : 'outline'} className="font-mono uppercase">
          {statusLabel}
        </Badge>
      </div>
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
          href={billingRoute(reason)}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-[18px] h-11 w-full')}
        >
          {lockedLabel}
        </Link>
      )}
    </div>
  )
}

// Deliberately independent of trip/memory data — these cards' content only
// depends on the user's plan, not which trip is selected, so switching
// trips in the header above never re-fetches or re-skeletons this section.
export function KeepsakesCardsDataWrapper({ tripId }: Props) {
  const t = useTranslations('trips.keepsakes')
  const tDetail = useTranslations('trips.detail')
  const { data: user, isLoading: userLoading } = useUser()

  const [zineSheetOpen, setZineSheetOpen] = useState(false)
  const [postcardSheetOpen, setPostcardSheetOpen] = useState(false)

  if (userLoading) {
    return (
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        <Skeleton className="h-[420px] rounded-[32px]" />
        <Skeleton className="h-[420px] rounded-[32px]" />
        <Skeleton className="h-[420px] rounded-[32px]" />
      </div>
    )
  }

  const canExport = user ? canExportPdf(user.plan) : false
  const statusLabel = canExport ? t('status_ready') : t('status_locked')

  return (
    <>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        <ExportCard
          icon="book-open"
          title={t('pdf_title')}
          description={tDetail('export_pdf_description')}
          ctaLabel={t('pdf_cta')}
          lockedLabel={t('locked_cta')}
          statusLabel={statusLabel}
          canExport={canExport}
          reason="pdf"
          href={`/api/trips/${tripId}/pdf`}
        />
        <ExportCard
          icon="fold"
          title={t('zine_title')}
          description={tDetail('export_zine_description')}
          ctaLabel={t('zine_cta')}
          lockedLabel={t('locked_cta')}
          statusLabel={statusLabel}
          canExport={canExport}
          reason="zine"
          onExport={() => setZineSheetOpen(true)}
        />
        <ExportCard
          icon="mail"
          title={t('postcard_title')}
          description={tDetail('export_postcard_description')}
          ctaLabel={t('postcard_cta')}
          lockedLabel={t('locked_cta')}
          statusLabel={statusLabel}
          canExport={canExport}
          reason="postcard"
          onExport={() => setPostcardSheetOpen(true)}
        />
      </div>

      <ZineExportSheet tripId={tripId} open={zineSheetOpen} onOpenChange={setZineSheetOpen} />
      <PostcardExportSheet
        tripId={tripId}
        open={postcardSheetOpen}
        onOpenChange={setPostcardSheetOpen}
      />
    </>
  )
}
