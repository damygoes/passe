'use client'

import { gentleSpring } from '@/lib/motion'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { ExitLink } from './ExitLink'

export function FinalCtaSection() {
  const t = useTranslations('landing.cta')

  return (
    <section className="px-6 pb-24 md:pb-32">
      <m.div
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[44px] bg-sandy-beige p-[clamp(36px,5vw,72px)]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <span
          aria-hidden
          className="absolute -top-[60px] -right-[60px] size-[280px] rounded-full bg-terracotta-500/16"
        />
        <span
          aria-hidden
          className="absolute -bottom-[90px] right-[120px] size-[200px] rounded-full bg-deep-olive-500/14"
        />

        <div className="relative max-w-[620px]">
          <h2 className="font-display text-[clamp(32px,4.4vw,56px)] leading-[1.05] text-dark-espresso-dark">
            {t('heading')}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-dark-espresso/85">{t('subtitle')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ExitLink
              href={routes.signUp}
              className={buttonVariants({ size: 'lg', className: 'h-[54px] px-7 text-base' })}
            >
              {t('button_primary')}
            </ExitLink>
            <ExitLink
              href={routes.signIn}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-[54px] px-7 text-base',
              })}
            >
              {t('button_secondary')}
            </ExitLink>
          </div>

          <p className="mt-6 font-mono text-[10.5px] tracking-[0.1em] text-dark-espresso/70 uppercase">
            {t('store_line')}
          </p>
        </div>
      </m.div>
    </section>
  )
}
