'use client'

import { usePointerTilt } from '@/components/motion/usePointerTilt'
import { snappySpring, staggerItemVariants } from '@/lib/motion'
import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import type { PlanType } from '@passe/auth/types'
import { Card, CardContent, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { Separator } from '@passe/ui/separator'
import { cn } from '@passe/utils'
import { m, type Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

const highlightedItemVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: snappySpring },
}

export interface PlanCardProps {
  plan: PlanType
  /** Marketing flourish: glow + lg:scale-[1.03] + snappier entrance. Always `plan === 'explorer'` in practice. */
  highlighted?: boolean
  /** Subtle ring marking the user's active plan, independent of `highlighted`. */
  current?: boolean
  /** Rendered top-right inside the card; caller supplies a positioned <Badge> or undefined. */
  badge?: ReactNode
  /** Footer content — CTA button(s)/link, fully owned by the caller. */
  footer: ReactNode
}

export function PlanCard({
  plan,
  highlighted = false,
  current = false,
  badge,
  footer,
}: PlanCardProps) {
  const t = useTranslations('landing.pricing')
  const { rotateX, rotateY, handlePointerMove, handlePointerLeave } = usePointerTilt(6)

  const limits = PLAN_LIMITS[plan]
  const exportBullets = limits.pdfExport
    ? [t('bullets.pdf_export_yes'), t('bullets.zine_export_yes'), t('bullets.postcard_export_yes')]
    : [t('bullets.pdf_export_no')]
  const bullets = [
    limits.maxTrips === Infinity
      ? t('bullets.trips_unlimited')
      : t('bullets.trips', { count: limits.maxTrips }),
    limits.maxMemoriesPerTrip === Infinity
      ? t('bullets.memories_unlimited')
      : t('bullets.memories', { count: limits.maxMemoriesPerTrip }),
    limits.publicPortfolio ? t('bullets.portfolio_yes') : t('bullets.portfolio_no'),
    ...exportBullets,
  ]

  return (
    <m.div
      variants={highlighted ? highlightedItemVariants : staggerItemVariants}
      className="relative h-full [perspective:1000px]"
    >
      {highlighted && (
        <m.div
          aria-hidden
          className="absolute -inset-1 rounded-2xl bg-primary/30 blur-xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <m.div
        className="h-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <Card
          className={cn(
            'relative h-full',
            (highlighted || current) && 'ring-2 ring-primary',
            highlighted && 'lg:scale-[1.03]',
          )}
        >
          {badge}
          <CardHeader>
            <h3 className="font-heading text-lg font-semibold">{t(`plans.${plan}.name`)}</h3>
            <p className="text-sm text-muted-foreground">{t(`plans.${plan}.tagline`)}</p>
          </CardHeader>
          <CardContent>
            <p>
              <span className="font-display text-5xl font-bold">{t(`plans.${plan}.price`)}</span>
              <span className="ml-1 text-sm text-muted-foreground">{t('per_month')}</span>
            </p>
            <Separator className="my-5" />
            <ul className="flex flex-col gap-3 text-sm">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2">
                  <Icon name="check" size="sm" className="text-primary" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">{footer}</CardFooter>
        </Card>
      </m.div>
    </m.div>
  )
}
