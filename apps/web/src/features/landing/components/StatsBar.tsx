import { Icon, type IconName } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import { Reveal } from '@/components/shared/Reveal'

const STATS = [
  { key: 'privacy', icon: 'lock' },
  { key: 'unlimited', icon: 'luggage' },
  { key: 'portfolio', icon: 'globe' },
] as const satisfies ReadonlyArray<{ key: string; icon: IconName }>

export async function StatsBar() {
  const t = await getTranslations('landing.stats')

  return (
    <section className="border-y border-border px-6 py-16">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-3">
        {STATS.map(({ key, icon }) => (
          <div
            key={key}
            className="flex flex-col items-center text-center sm:items-start sm:text-left"
          >
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name={icon} size="lg" aria-hidden />
            </div>
            <h3 className="font-heading text-lg font-semibold">{t(`${key}.title`)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${key}.description`)}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
