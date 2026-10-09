'use client'

import { staggerItemVariants } from '@/lib/motion'
import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import type { PlanType } from '@passe/auth/types'
import { cn } from '@passe/utils'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

// The dark, elevated fill marks whichever plan the caller is featuring — on the
// landing page that is always Explorer, but on /billing it follows the feature the
// user was blocked on, so it can't be keyed off the plan itself.
const FEATURED_TONE = 'bg-dark-espresso-dark text-aged-cream shadow-soft-lg'
const DEFAULT_TONE =
  'bg-popover text-foreground border border-[color:var(--color-divider)] shadow-soft-sm'

export interface PlanCardProps {
  plan: PlanType
  /** Subtle ring marking the user's active plan. */
  current?: boolean
  /** Gives this card the dark elevated fill — the caller decides which plan it lands on. */
  featured?: boolean
  /** Rendered top-right inside the card; caller supplies a positioned <Badge> or undefined. */
  badge?: ReactNode
  /** Footer content — CTA button(s)/link, fully owned by the caller. */
  footer: ReactNode
}

export function PlanCard({
  plan,
  current = false,
  featured = false,
  badge,
  footer,
}: PlanCardProps) {
  const t = useTranslations('landing.pricing')

  const limits = PLAN_LIMITS[plan]
  const exportFeatures = limits.pdfExport
    ? [t('bullets.pdf_export_yes'), t('bullets.zine_export_yes'), t('bullets.postcard_export_yes')]
    : []
  const features = [
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
    ...exportFeatures,
  ]

  return (
    <m.div variants={staggerItemVariants} className="relative h-full">
      <div
        className={cn(
          'relative flex h-full flex-col rounded-[34px] p-[30px_28px]',
          featured ? FEATURED_TONE : DEFAULT_TONE,
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
        <p className="mt-3 text-[14px] leading-snug opacity-80">{t(`plans.${plan}.tagline`)}</p>
        <ul className="mt-5 flex-1 space-y-2 text-[14.5px] leading-snug opacity-[0.88]">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span
                className="mt-[7px] size-1.5 shrink-0 rounded-full bg-current opacity-50"
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-[22px]">{footer}</div>
      </div>
    </m.div>
  )
}
