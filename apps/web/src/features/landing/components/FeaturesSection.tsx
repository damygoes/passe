'use client'

import { gentleSpring } from '@/lib/motion'
import type { IconName } from '@passe/ui/icon'
import { m } from 'motion/react'
import type { StaticImageData } from 'next/image'
import { useTranslations } from 'next-intl'
import { FEATURES_PHOTOS } from '../constants'
import { PhotoTextRow } from './PhotoTextRow'
import { SectionHeading } from './SectionHeading'
import { SectionStamp } from './SectionStamp'

const FEATURES = [
  { key: 'trips', icon: 'map', image: FEATURES_PHOTOS[0] },
  { key: 'memories', icon: 'location', image: FEATURES_PHOTOS[1] },
  { key: 'portfolio', icon: 'globe', image: FEATURES_PHOTOS[2] },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName; image: StaticImageData }>

export function FeaturesSection() {
  const t = useTranslations('landing.features')

  return (
    <section className="relative overflow-x-hidden px-6 py-24 md:py-32">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-24 top-1/3 -z-10 size-80 rounded-full bg-deep-olive/10 blur-3xl [animation-delay:-6s]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionStamp className="-top-6 right-2 md:right-8" rotate={-10} />
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <SectionHeading title={t('heading')} subtitle={t('subheading')} />
        </m.div>

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
