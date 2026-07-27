'use client'

import { gentleSpring, staggerContainerVariants, staggerItemVariants } from '@/lib/motion'
import { Icon } from '@passe/ui/icon'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { SectionHeading } from './SectionHeading'
import { SectionStamp } from './SectionStamp'

const POINTS = ['point1', 'point2', 'point3'] as const

export function PrivacySection() {
  const t = useTranslations('landing.privacy')

  return (
    <section className="bg-deep-olive px-6 py-24 text-aged-cream md:py-32">
      <m.div
        className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <SectionStamp className="-top-4 right-0 md:right-8" rotate={-14} />
        <div className="relative mb-6 flex items-center justify-center">
          <m.div
            aria-hidden
            className="absolute size-20 rounded-full bg-aged-cream/20"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative rounded-full bg-aged-cream/10 p-3">
            <Icon name="lock" size="lg" aria-hidden />
          </div>
        </div>
        <SectionHeading
          eyebrow={t('eyebrow')}
          eyebrowClassName="text-aged-cream/70"
          title={t('heading')}
          subtitle={t('description')}
          subtitleClassName="text-aged-cream/80"
        />

        <m.ul
          className="mt-10 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '0px 0px -10% 0px' }}
        >
          {POINTS.map((point) => (
            <m.li
              key={point}
              variants={staggerItemVariants}
              className="flex items-center justify-center gap-2"
            >
              <Icon name="check" size="sm" aria-hidden />
              {t(point)}
            </m.li>
          ))}
        </m.ul>
      </m.div>
    </section>
  )
}
