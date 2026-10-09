'use client'

import { gentleSpring } from '@/lib/motion'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { m } from 'motion/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { HOW_PHOTO } from '../constants'
import { ExitLink } from './ExitLink'

const STEPS = ['step1', 'step2', 'step3'] as const

export function HowItWorksSection() {
  const t = useTranslations('landing.how')

  return (
    <section id="how" className="scroll-mt-[68px] bg-secondary/30 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-[clamp(28px,4vw,54px)]">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-[clamp(30px,3.8vw,48px)] leading-[1.08]">
            {t('heading')}
          </h2>

          <div className="mt-8 flex flex-col gap-[22px]">
            {STEPS.map((key, index) => (
              <div key={key} className="flex items-start gap-4">
                <span className="font-display flex size-[46px] shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-lg text-aged-cream">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-1.5">
                  <h3 className="font-display text-2xl">{t(`${key}.title`)}</h3>
                  <p className="mt-1.5 max-w-[420px] text-[14.5px] leading-relaxed text-muted-foreground">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ExitLink
            href={routes.signUp}
            className={buttonVariants({ size: 'lg', className: 'mt-8 h-[50px] px-6.5' })}
          >
            {t('cta')}
          </ExitLink>
        </m.div>

        <m.div
          className="washed relative aspect-[5/4] w-full overflow-hidden rounded-[34px] shadow-soft-md"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={{ ...gentleSpring, delay: 0.1 }}
        >
          <Image
            src={HOW_PHOTO}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </m.div>
      </div>
    </section>
  )
}
