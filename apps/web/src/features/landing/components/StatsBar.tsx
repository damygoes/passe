'use client'

import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Icon, type IconName } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'

const STATS = [
  { key: 'privacy', icon: 'lock' },
  { key: 'unlimited', icon: 'luggage' },
  { key: 'portfolio', icon: 'globe' },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName }>

export function StatsBar() {
  const t = useTranslations('landing.stats')

  return (
    <section className="border-y border-border px-6 py-20">
      <Stagger inView className="mx-auto grid max-w-6xl grid-cols-1 gap-12 sm:grid-cols-3">
        {STATS.map(({ key, icon }) => (
          <StaggerItem
            key={key}
            className="flex flex-col items-center text-center sm:items-start sm:text-left"
          >
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name={icon} size="xl" aria-hidden />
            </div>
            <h3 className="font-display text-2xl font-semibold">{t(`${key}.title`)}</h3>
            <p className="mt-2 text-muted-foreground">{t(`${key}.description`)}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
