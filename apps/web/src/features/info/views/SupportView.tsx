import { buttonVariants } from '@passe/ui/button'
import { getTranslations } from 'next-intl/server'
import { FaqList } from '../components/FaqList'
import { InfoPageShell } from '../components/InfoPageShell'
import { INFO_MESSAGE_VALUES, SUPPORT_EMAIL } from '../constants'

const FAQ_ITEMS = ['what', 'visibility', 'plans', 'cancel', 'delete', 'contact'] as const

export async function SupportView() {
  const t = await getTranslations('info.support')

  return (
    <InfoPageShell eyebrow={t('eyebrow')} title={t('title')}>
      <div>
        <p className="text-sm leading-relaxed text-muted-foreground">{t('intro')}</p>
        <a href={`mailto:${SUPPORT_EMAIL}`} className={buttonVariants({ className: 'mt-6' })}>
          {t('contact_cta')}
        </a>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold tracking-tight">{t('faq_title')}</h2>
        <div className="mt-6">
          <FaqList
            items={FAQ_ITEMS.map((itemKey) => ({
              question: t(`faq.${itemKey}.question`),
              answer: t(`faq.${itemKey}.answer`, INFO_MESSAGE_VALUES),
            }))}
          />
        </div>
      </section>
    </InfoPageShell>
  )
}
