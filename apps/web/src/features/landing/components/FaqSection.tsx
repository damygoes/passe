import { getTranslations } from 'next-intl/server'
import { FaqAccordion, type FaqItem } from './FaqAccordion'

const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export async function FaqSection() {
  const t = await getTranslations('landing.faq')

  const items: FaqItem[] = QUESTION_KEYS.map((key) => ({
    id: key,
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  }))

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[900px]">
        <h2 className="font-display text-[clamp(28px,3.4vw,42px)] leading-[1.1]">{t('heading')}</h2>
        <div className="mt-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}
