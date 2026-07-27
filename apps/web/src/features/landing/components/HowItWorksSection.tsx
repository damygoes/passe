import type { IconName } from '@passe/ui/icon'
import type { StaticImageData } from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'
import { HOW_PHOTOS } from '../constants'
import { PhotoTextRow } from './PhotoTextRow'

const STEPS = [
  { key: 'step1', icon: 'map', image: HOW_PHOTOS[0] },
  { key: 'step2', icon: 'camera', image: HOW_PHOTOS[1] },
  { key: 'step3', icon: 'share', image: HOW_PHOTOS[2] },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName; image: StaticImageData }>

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

        <div className="mt-16 flex flex-col gap-20">
          {STEPS.map(({ key, icon, image }, i) => (
            <PhotoTextRow
              key={key}
              reversed={i % 2 === 1}
              stepNumber={i + 1}
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
