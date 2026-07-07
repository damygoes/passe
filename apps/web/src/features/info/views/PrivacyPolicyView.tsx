import { getTranslations } from 'next-intl/server'
import { InfoPageShell } from '../components/InfoPageShell'
import { LegalSection } from '../components/LegalSection'
import { INFO_MESSAGE_VALUES } from '../constants'
import { resolveLegalSection, type LegalSectionSpec } from '../utils/legalSections'

const SECTIONS: LegalSectionSpec[] = [
  { key: 'controller', paragraphs: 3 },
  { key: 'overview', paragraphs: 2 },
  { key: 'data', paragraphs: 1, listItems: 4 },
  { key: 'purposes', paragraphs: 1, listItems: 4 },
  { key: 'processors', paragraphs: 1, listItems: 6 },
  { key: 'public_content', paragraphs: 2 },
  { key: 'cookies', paragraphs: 2 },
  { key: 'transfers', paragraphs: 1 },
  { key: 'retention', paragraphs: 2 },
  { key: 'rights', paragraphs: 1, listItems: 7, outro: 1 },
  { key: 'changes', paragraphs: 1 },
  { key: 'contact', paragraphs: 1 },
]

export async function PrivacyPolicyView() {
  const t = await getTranslations('info.privacy')

  return (
    <InfoPageShell eyebrow={t('eyebrow')} title={t('title')} lastUpdated={t('last_updated')}>
      {SECTIONS.map((section, sectionIndex) => {
        const { heading, ...content } = resolveLegalSection(t, section, INFO_MESSAGE_VALUES)
        return (
          <LegalSection
            key={section.key}
            heading={`${sectionIndex + 1}. ${heading}`}
            {...content}
          />
        )
      })}
    </InfoPageShell>
  )
}
