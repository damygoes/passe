'use client'

import { staggerItemVariants } from '@/lib/motion'
import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import type { PlanType } from '@passe/auth/types'
import { cn } from '@passe/utils'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

const PLAN_TONE_CLASSES: Record<PlanType, string> = {
  free: 'bg-popover text-foreground',
  explorer: 'bg-secondary text-foreground',
  collector: 'bg-dark-espresso text-aged-cream',
}

export interface PlanCardProps {
  plan: PlanType
  /** Subtle ring marking the user's active plan. */
  current?: boolean
  /** Rendered top-right inside the card; caller supplies a positioned <Badge> or undefined. */
  badge?: ReactNode
  /** Footer content — CTA button(s)/link, fully owned by the caller. */
  footer: ReactNode
}

export function PlanCard({ plan, current = false, badge, footer }: PlanCardProps) {
  const t = useTranslations('landing.pricing')

  const limits = PLAN_LIMITS[plan]
  const exportSummary = limits.pdfExport
    ? [t('bullets.pdf_export_yes'), t('bullets.zine_export_yes'), t('bullets.postcard_export_yes')]
    : []
  const summary = [
    limits.maxTrips === Infinity
      ? t('bullets.trips_unlimited')
      : t('bullets.trips', { count: limits.maxTrips }),
    limits.maxMemoriesPerTrip === Infinity
      ? t('bullets.memories_unlimited')
      : t('bullets.memories', { count: limits.maxMemoriesPerTrip }),
    limits.publicPortfolio ? t('bullets.portfolio_yes') : t('bullets.portfolio_no'),
    limits.maxPublicMemoriesPerTrip === Infinity
      ? t('bullets.public_memories_unlimited')
      : t('bullets.public_memories_limited', { count: limits.maxPublicMemoriesPerTrip }),
    ...exportSummary,
  ].join(' · ')

  return (
    <m.div variants={staggerItemVariants} className="relative h-full">
      <div
        className={cn(
          'relative flex h-full flex-col rounded-[32px] p-[30px_28px] shadow-sm',
          PLAN_TONE_CLASSES[plan],
          current && 'ring-2 ring-primary',
        )}
      >
        {badge}
        <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase">
          {t(`plans.${plan}.name`)}
        </div>
        <div className="font-display mt-3.5 text-[52px] leading-none">
          {t(`plans.${plan}.price`)}
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.1em] uppercase opacity-60">
          {t('per_month')}
        </div>
        <p className="mt-5 flex-1 text-[14.5px] leading-[1.8] opacity-[0.88]">{summary}</p>
        <div className="mt-[22px]">{footer}</div>
      </div>
    </m.div>
  )
}
