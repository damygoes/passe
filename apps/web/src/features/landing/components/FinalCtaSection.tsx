'use client'

import { gentleSpring } from '@/lib/motion'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { ExitLink } from './ExitLink'
import { SectionHeading } from './SectionHeading'
import { SectionStamp } from './SectionStamp'

export function FinalCtaSection() {
  const t = useTranslations('landing.cta')

  return (
    <section className="px-6 pb-24 md:pb-32">
      <m.div
        className="relative mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <SectionStamp className="-top-6 right-2 md:right-10" rotate={-16} />
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark px-8 py-16 text-center text-aged-cream md:py-24">
          <m.div
            aria-hidden
            className="absolute top-8 right-10 opacity-30"
            animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon name="sparkles" size="2xl" aria-hidden />
          </m.div>
          <m.div
            aria-hidden
            className="absolute bottom-10 left-12 opacity-20"
            animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Icon name="sparkles" size="lg" aria-hidden />
          </m.div>
          <m.div
            aria-hidden
            className="absolute top-16 left-1/4 hidden opacity-20 md:block"
            animate={{ x: [0, 16, 0], y: [0, -6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Icon name="plane" size="xl" aria-hidden />
          </m.div>

          <SectionHeading
            title={t('heading')}
            subtitle={t('subtitle')}
            subtitleClassName="text-aged-cream/80"
          />
          <ExitLink
            href={routes.signUp}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'group relative mt-10 overflow-hidden bg-aged-cream text-dark-espresso transition-all hover:-translate-y-0.5 hover:bg-warm-white hover:shadow-lg',
            )}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 z-0 w-1/3 -translate-x-[250%] -skew-x-12 bg-white/50 transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              {t('button')}
              <Icon name="arrow-right" size="sm" aria-hidden />
            </span>
          </ExitLink>
        </div>
      </m.div>
    </section>
  )
}
