import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { Separator } from '@passe/ui/separator'
import { cn } from '@passe/utils'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Reveal } from '@/components/shared/Reveal'

const PLANS = ['free', 'explorer', 'collector'] as const

export async function PricingSection() {
  const t = await getTranslations('landing.pricing')

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('subheading')}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const limits = PLAN_LIMITS[plan]
            const highlighted = plan === 'explorer'
            const bullets = [
              limits.maxTrips === Infinity
                ? t('bullets.trips_unlimited')
                : t('bullets.trips', { count: limits.maxTrips }),
              limits.maxMemoriesPerTrip === Infinity
                ? t('bullets.memories_unlimited')
                : t('bullets.memories', { count: limits.maxMemoriesPerTrip }),
              limits.publicPortfolio ? t('bullets.portfolio_yes') : t('bullets.portfolio_no'),
            ]

            return (
              <Card
                key={plan}
                className={cn(
                  'relative h-full',
                  highlighted && 'ring-2 ring-primary lg:scale-[1.03]',
                )}
              >
                {highlighted && (
                  <Badge className="absolute top-4 right-4">{t('most_popular')}</Badge>
                )}
                <CardHeader>
                  <h3 className="font-heading text-lg font-semibold">{t(`plans.${plan}.name`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`plans.${plan}.tagline`)}</p>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="font-display text-4xl font-bold">
                      {t(`plans.${plan}.price`)}
                    </span>
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
                <CardFooter className="mt-auto">
                  <Link
                    href={routes.signUp}
                    className={buttonVariants({
                      variant: highlighted ? 'default' : 'outline',
                      className: 'w-full',
                    })}
                  >
                    {t(`plans.${plan}.cta`)}
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
