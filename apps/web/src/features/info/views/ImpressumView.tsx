import { getTranslations } from 'next-intl/server'
import { InfoPageShell } from '../components/InfoPageShell'
import { LegalSection } from '../components/LegalSection'
import { INFO_MESSAGE_VALUES } from '../constants'
import { resolveLegalSection, type LegalSectionSpec } from '../utils/legalSections'

const SECTIONS: LegalSectionSpec[] = [
  { key: 'provider', paragraphs: 3 },
  { key: 'contact', paragraphs: 1 },
  { key: 'responsible', paragraphs: 1 },
  { key: 'dispute', paragraphs: 2 },
]

export async function ImpressumView() {
  const t = await getTranslations('info.impressum')

  return (
    <InfoPageShell eyebrow={t('eyebrow')} title={t('title')}>
      {SECTIONS.map((section) => (
        <LegalSection
          key={section.key}
          {...resolveLegalSection(t, section, INFO_MESSAGE_VALUES)}
        />
      ))}
    </InfoPageShell>
  )
}
