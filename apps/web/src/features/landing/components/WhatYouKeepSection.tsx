'use client'

import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { gentleSpring } from '@/lib/motion'
import type { IconName } from '@passe/ui/icon'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { BenefitCard, type BenefitCardProps } from './BenefitCard'
import { SectionHeading } from './SectionHeading'

const CARDS = [
  { key: 'private', icon: 'lock', tone: 'terracotta' },
  { key: 'map', icon: 'globe', tone: 'olive' },
  { key: 'keepsakes', icon: 'bookmark', tone: 'terracotta' },
  { key: 'share', icon: 'share', tone: 'olive' },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName; tone: BenefitCardProps['tone'] }>

export function WhatYouKeepSection() {
  const t = useTranslations('landing.keep')

  return (
    <section id="keep" className="scroll-mt-[68px] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <m.div
          className="max-w-[620px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} subtitle={t('description')} />
        </m.div>

        <Stagger inView className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5">
          {CARDS.map(({ key, icon, tone }) => (
            <StaggerItem key={key} className="h-full">
              <BenefitCard
                icon={icon}
                tone={tone}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
