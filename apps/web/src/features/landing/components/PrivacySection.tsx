import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'

const POINTS = ['point1', 'point2', 'point3'] as const

export async function PrivacySection() {
  const t = await getTranslations('landing.privacy')

  return (
    <section className="bg-deep-olive px-6 py-24 text-aged-cream md:py-32">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="mb-6 rounded-full bg-aged-cream/10 p-3">
          <Icon name="lock" size="lg" aria-hidden />
        </div>
        <p className="text-xs font-medium tracking-widest text-aged-cream/70 uppercase">
          {t('eyebrow')}
        </p>
        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {t('heading')}
        </h2>
        <p className="mt-6 text-aged-cream/80">{t('description')}</p>

        <ul className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center justify-center gap-2">
              <Icon name="check" size="sm" aria-hidden />
              {t(point)}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
