import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import { APP_STORE_URL } from '../constants'

export async function StoreBadges({ className }: { className?: string }) {
  const t = await getTranslations('landing.storeBadges')

  return (
    <div className={className}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        <div className="flex h-[52px] items-center gap-2.5 rounded-full bg-dark-espresso-dark px-4 text-aged-cream">
          <Icon name="apple" size="xl" aria-hidden />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-mono text-[8.5px] tracking-[0.14em] uppercase opacity-70">
              {t('ios_eyebrow')}
            </span>
            <span className="text-[15px]">{t('ios_name')}</span>
          </span>
        </div>
      </a>
    </div>
  )
}
