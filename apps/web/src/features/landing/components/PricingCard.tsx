'use client'

import { PlanCard } from '@/components/shared/PlanCard'
import { routes } from '@/lib/routes'
import type { PlanType } from '@passe/auth/types'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { ExitLink } from './ExitLink'

export function PricingCard({ plan }: { plan: PlanType }) {
  const t = useTranslations('landing.pricing')
  const highlighted = plan === 'explorer'

  return (
    <PlanCard
      plan={plan}
      badge={highlighted && <Badge className="absolute top-4 right-4">{t('most_popular')}</Badge>}
      footer={
        <ExitLink
          href={routes.signUp}
          className={buttonVariants({
            variant: highlighted ? 'default' : 'outline',
            className: cn(
              'w-full',
              highlighted && 'bg-aged-cream text-dark-espresso-dark hover:bg-aged-cream/90',
            ),
          })}
        >
          {t(`plans.${plan}.cta`)}
        </ExitLink>
      }
    />
  )
}
