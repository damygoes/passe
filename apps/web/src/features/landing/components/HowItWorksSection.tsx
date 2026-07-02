import { Icon, type IconName } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'

const STEPS = [
  { key: 'step1', icon: 'map' },
  { key: 'step2', icon: 'camera' },
  { key: 'step3', icon: 'share' },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName }>

export async function HowItWorksSection() {
  const t = await getTranslations('landing.how')

  return (
    <section className="bg-secondary/30 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('subheading')}</p>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden
            className="absolute top-24 right-0 left-0 hidden border-t border-dashed border-border md:block"
          />
          {STEPS.map(({ key, icon }, i) => (
            <Reveal key={key} delay={i * 150} className="relative">
              <span aria-hidden className="font-display block text-7xl font-bold text-primary/15">
                {i + 1}
              </span>
              <div className="relative -mt-4 mb-4 flex size-11 items-center justify-center rounded-full bg-background text-primary ring-1 ring-border">
                <Icon name={icon} size="md" aria-hidden />
              </div>
              <h3 className="font-heading text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`${key}.description`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
