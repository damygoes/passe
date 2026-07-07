import type { getTranslations } from 'next-intl/server'

type Translator = Awaited<ReturnType<typeof getTranslations>>

export interface LegalSectionSpec {
  key: string
  paragraphs: number
  listItems?: number
  outro?: number
}

// Expands a section spec into translated strings: sections.<key>.heading, .p1…pN, .li1…liN, .o1…oN
export function resolveLegalSection(
  t: Translator,
  spec: LegalSectionSpec,
  values?: Record<string, string>,
) {
  return {
    heading: t(`sections.${spec.key}.heading`, values),
    paragraphs: Array.from({ length: spec.paragraphs }, (_, paragraphIndex) =>
      t(`sections.${spec.key}.p${paragraphIndex + 1}`, values),
    ),
    listItems: spec.listItems
      ? Array.from({ length: spec.listItems }, (_, itemIndex) =>
          t(`sections.${spec.key}.li${itemIndex + 1}`, values),
        )
      : undefined,
    outro: spec.outro
      ? Array.from({ length: spec.outro }, (_, outroIndex) =>
          t(`sections.${spec.key}.o${outroIndex + 1}`, values),
        )
      : undefined,
  }
}
