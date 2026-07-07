import { getTranslations } from 'next-intl/server'
import { InfoPageShell } from '../components/InfoPageShell'
import { LegalSection } from '../components/LegalSection'
import { INFO_MESSAGE_VALUES } from '../constants'
import { resolveLegalSection, type LegalSectionSpec } from '../utils/legalSections'

const SECTIONS: LegalSectionSpec[] = [
  { key: 'scope', paragraphs: 2 },
  { key: 'service', paragraphs: 2 },
  { key: 'account', paragraphs: 2 },
  { key: 'billing', paragraphs: 3 },
  { key: 'content', paragraphs: 3 },
  { key: 'acceptable_use', paragraphs: 1, listItems: 4 },
  { key: 'privacy', paragraphs: 1 },
  { key: 'availability', paragraphs: 1 },
  { key: 'termination', paragraphs: 2 },
  { key: 'liability', paragraphs: 2 },
  { key: 'changes', paragraphs: 1 },
  { key: 'law', paragraphs: 1 },
]

export async function TermsOfServiceView() {
  const t = await getTranslations('info.terms')

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
