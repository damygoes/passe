'use client'

import { CountUp } from '@/components/motion/CountUp'
import { gentleSpring } from '@/lib/motion'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'

// Placeholder until a real figure is available — replace before launch.
const ARCHIVE_COUNT = 12480

export function ArchiveStatSection() {
  const t = useTranslations('landing.archiveStat')

  return (
    <section className="border-y border-border px-6 py-16 text-center">
      <m.div
        className="mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <p className="font-display text-5xl font-bold text-primary md:text-6xl">
          <CountUp value={ARCHIVE_COUNT} />+
        </p>
        <p className="mt-3 text-muted-foreground">{t('label')}</p>
      </m.div>
    </section>
  )
}
