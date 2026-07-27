'use client'

import { usePointerTilt } from '@/components/motion/usePointerTilt'
import { gentleSpring, snappySpring } from '@/lib/motion'
import { routes } from '@/lib/routes'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { HERO_PHOTO } from '../constants'
import { ExitLink } from './ExitLink'
import { FlightPathDoodle } from './FlightPathDoodle'
import { PostmarkBadge } from './PostmarkBadge'

const MARQUEE_PLACES = [
  'Kyoto',
  'Lisboa',
  'Marrakesh',
  'Oaxaca',
  'Reykjavík',
  'Hà Nội',
  'Valparaíso',
  'Zanzibar',
  'Santorini',
  'Kathmandu',
]

export function HeroSection() {
  const t = useTranslations('landing.hero')
  const { rotateX, rotateY, handlePointerMove, handlePointerLeave } = usePointerTilt()

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="animate-drift absolute -right-32 -bottom-16 size-[36rem] rounded-full bg-deep-olive/10 blur-3xl [animation-delay:-10s]"
      />
      <FlightPathDoodle className="pointer-events-none absolute inset-x-0 top-[38%] hidden h-32 w-full md:block" />

      <div className="relative flex flex-1 items-center px-6 py-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <m.div
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...snappySpring, delay: 0.1 }}
            >
              <Badge variant="secondary" className="mb-6">
                <Icon name="sparkles" size="xs" aria-hidden />
                {t('eyebrow')}
              </Badge>
            </m.div>

            <h1 className="font-display max-w-2xl text-6xl leading-[0.95] font-bold tracking-tight text-balance sm:text-7xl md:text-8xl">
              <m.span
                className="block"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...gentleSpring, delay: 0.2 }}
              >
                {t('title_leading')}
              </m.span>
              <m.span
                className="text-primary block italic"
                initial={{ opacity: 0, y: 36, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...snappySpring, delay: 0.45 }}
              >
                {t('title_accent')}
              </m.span>
            </h1>

            <m.p
              className="mt-6 max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...gentleSpring, delay: 0.55 }}
            >
              {t('subtitle')}
            </m.p>

            <m.div
              className="mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...gentleSpring, delay: 0.65 }}
            >
              <ExitLink
                href={routes.signUp}
                className={buttonVariants({
                  size: 'lg',
                  className: 'transition-all hover:-translate-y-0.5 hover:shadow-lg',
                })}
              >
                {t('cta_primary')}
                <m.span
                  className="inline-flex"
                  initial={false}
                  whileHover={{ x: 4 }}
                  transition={snappySpring}
                >
                  <Icon name="arrow-right" size="sm" aria-hidden />
                </m.span>
              </ExitLink>
              <ExitLink
                href={routes.signIn}
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                {t('cta_secondary')}
              </ExitLink>
            </m.div>

            <m.p
              className="mt-6 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              {t('note')}
            </m.p>
          </div>

          <div className="relative [perspective:1200px]">
            <PostmarkBadge className="animate-spin-slow pointer-events-none absolute -top-6 -right-6 z-20 hidden size-16 text-dark-espresso/25 md:block" />

            {/* Back card — solid depth layer, no second photo (keeps every trip photo distinct down the page) */}
            <m.div
              aria-hidden
              className="absolute -right-4 -bottom-4 aspect-[4/3] w-[92%] rounded-xl bg-sandy-beige shadow-lg"
              initial={{ opacity: 0, rotate: -10, scale: 0.92 }}
              animate={{ opacity: 1, rotate: -6, scale: 1 }}
              transition={{ ...gentleSpring, delay: 0.5 }}
            />

            {/* Front polaroid — cursor-tilt on pointer move */}
            <m.div
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border-4 border-aged-cream shadow-xl [transform-style:preserve-3d]"
              style={{ rotate: 3, rotateX, rotateY }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...gentleSpring, delay: 0.3 }}
            >
              <Image
                src={HERO_PHOTO}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 62vw"
              />
            </m.div>
          </div>
        </div>
      </div>

      {/* Place-name marquee — decorative */}
      <div
        aria-hidden
        className="relative pb-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
      >
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...MARQUEE_PLACES, ...MARQUEE_PLACES].map((place, i) => (
            <span
              key={i}
              className="font-display text-3xl text-muted-foreground/40 italic md:text-4xl"
            >
              {place} ·
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
