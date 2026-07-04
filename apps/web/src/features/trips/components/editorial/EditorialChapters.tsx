import type { EditorialChapter, EditorialSectionVariant } from '@passe/utils'
import type { ReactNode } from 'react'
import { CarouselSection } from './CarouselSection'
import { HeroSection } from './HeroSection'
import { ImageTextSection } from './ImageTextSection'
import { TextSection } from './TextSection'
import type { EditorialMemoryData } from './editorial-types'

interface Props {
  chapters: EditorialChapter<EditorialMemoryData>[]
  photoAlt: string
  // Owner page injects the per-section toolbar here; public page omits it
  renderSectionFooter?: (memoryId: string, variant: EditorialSectionVariant) => ReactNode
}

function Section({
  memory,
  variant,
  photoAlt,
}: {
  memory: EditorialMemoryData
  variant: EditorialSectionVariant
  photoAlt: string
}) {
  switch (variant) {
    case 'hero':
      return <HeroSection memory={memory} photoAlt={photoAlt} />
    case 'imageLeft':
      return <ImageTextSection memory={memory} side="left" photoAlt={photoAlt} />
    case 'imageRight':
      return <ImageTextSection memory={memory} side="right" photoAlt={photoAlt} />
    case 'carousel':
      return <CarouselSection memory={memory} photoAlt={photoAlt} />
    case 'text':
      return <TextSection memory={memory} />
  }
}

export function EditorialChapters({ chapters, photoAlt, renderSectionFooter }: Props) {
  return (
    <div>
      {chapters.map((chapter) => (
        <section key={chapter.key}>
          <header className="mb-8 mt-16 first:mt-8">
            {chapter.subtitle && (
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {chapter.subtitle}
              </p>
            )}
            <h3 className="font-heading mt-1 text-3xl text-foreground">{chapter.title}</h3>
            <div className="mt-3 h-px w-16 bg-primary" />
          </header>

          <div className="space-y-12">
            {chapter.sections.map(({ memory, variant }) => (
              <div key={memory.id} className="group">
                <Section memory={memory} variant={variant} photoAlt={photoAlt} />
                {renderSectionFooter?.(memory.id, variant)}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
