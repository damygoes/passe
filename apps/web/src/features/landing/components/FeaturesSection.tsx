import { Card, CardDescription, CardHeader, CardTitle } from '@passe/ui/card'
import { Icon, type IconName } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'

const FEATURES = [
  { key: 'trips', icon: 'map' },
  { key: 'memories', icon: 'location' },
  { key: 'portfolio', icon: 'globe' },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName }>

export async function FeaturesSection() {
  const t = await getTranslations('landing.features')

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('subheading')}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map(({ key, icon }, i) => (
            <Reveal key={key} delay={i * 120}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:ring-primary/30">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name={icon} size="lg" aria-hidden />
                  </div>
                  <CardTitle>{t(`${key}.title`)}</CardTitle>
                  <CardDescription>{t(`${key}.description`)}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
