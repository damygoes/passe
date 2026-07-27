import type { IconName } from '@passe/ui/icon'
import type { StaticImageData } from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'
import { FEATURES_PHOTOS } from '../constants'
import { PhotoTextRow } from './PhotoTextRow'

const FEATURES = [
  { key: 'trips', icon: 'map', image: FEATURES_PHOTOS[0] },
  { key: 'memories', icon: 'location', image: FEATURES_PHOTOS[1] },
  { key: 'portfolio', icon: 'globe', image: FEATURES_PHOTOS[2] },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName; image: StaticImageData }>

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

        <div className="mt-16 flex flex-col gap-20">
          {FEATURES.map(({ key, icon, image }, i) => (
            <PhotoTextRow
              key={key}
              reversed={i % 2 === 1}
              imageSrc={image}
              imageAlt=""
              icon={icon}
              title={t(`${key}.title`)}
              description={t(`${key}.description`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
