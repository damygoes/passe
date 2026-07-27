'use client'

import { gentleSpring } from '@/lib/motion'
import type { IconName } from '@passe/ui/icon'
import { m } from 'motion/react'
import type { StaticImageData } from 'next/image'
import { useTranslations } from 'next-intl'
import { HOW_PHOTOS } from '../constants'
import { PhotoTextRow } from './PhotoTextRow'
import { SectionHeading } from './SectionHeading'
import { SectionStamp } from './SectionStamp'

const STEPS = [
  { key: 'step1', icon: 'map', image: HOW_PHOTOS[0] },
  { key: 'step2', icon: 'camera', image: HOW_PHOTOS[1] },
  { key: 'step3', icon: 'share', image: HOW_PHOTOS[2] },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName; image: StaticImageData }>

export function HowItWorksSection() {
  const t = useTranslations('landing.how')

  return (
    <section className="overflow-x-hidden bg-secondary/30 px-6 py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl">
        <SectionStamp className="-top-6 left-2 md:left-8" rotate={9} />
        <m.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <SectionHeading title={t('heading')} subtitle={t('subheading')} />
        </m.div>

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
