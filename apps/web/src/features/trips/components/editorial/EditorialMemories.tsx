'use client'

import type { Memory } from '@passe/types/memory'
import { buildEditorialChapters } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { EditorialChapters } from './EditorialChapters'
import { SectionToolbar } from './SectionToolbar'

interface Props {
  memories: Memory[]
}

// Owner view: editorial layout plus the per-section override toolbar
export function EditorialMemories({ memories }: Props) {
  const t = useTranslations('trips.memory_card')
  const tEditorial = useTranslations('trips.editorial')

  const chapters = useMemo(() => buildEditorialChapters(memories), [memories])

  const { byId, orderedIds } = useMemo(() => {
    const flat = chapters.flatMap((chapter) => chapter.sections)
    return {
      byId: new Map(flat.map((section) => [section.memory.id, section.memory])),
      orderedIds: flat.map((section) => section.memory.id),
    }
  }, [chapters])

  return (
    <EditorialChapters
      chapters={chapters}
      photoAlt={t('photo_alt')}
      scrollLeftLabel={tEditorial('scroll_left')}
      scrollRightLabel={tEditorial('scroll_right')}
      renderSectionFooter={(memoryId, variant) => {
        const memory = byId.get(memoryId)
        if (!memory) return null
        return (
          <SectionToolbar
            memory={memory}
            resolvedVariant={variant}
            orderedIds={orderedIds}
            index={orderedIds.indexOf(memoryId)}
          />
        )
      }}
    />
  )
}
