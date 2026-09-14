'use client'

import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { useTranslations } from 'next-intl'

const ITEMS = ['journals', 'memories', 'public', 'exportable'] as const

export function ProofStrip() {
  const t = useTranslations('landing.proof')

  return (
    <section className="border-y border-[color:var(--color-divider)] px-6 py-[26px]">
      <Stagger
        inView
        className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
      >
        {ITEMS.map((key) => (
          <StaggerItem key={key} className="flex items-baseline gap-3">
            <span className="font-display text-[clamp(28px,3vw,38px)] leading-none">
              {t(`${key}.value`)}
            </span>
            <span className="font-mono text-[10.5px] leading-tight tracking-[0.12em] text-muted-foreground uppercase">
              {t(`${key}.label`)}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
