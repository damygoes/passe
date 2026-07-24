import { Badge } from '@passe/ui/badge'
import type { EditorialChapter, EditorialSectionVariant } from '@passe/utils'
import type { ReactNode } from 'react'
import { CarouselSection } from './CarouselSection'
import { HeroSection } from './HeroSection'
import { ImageTextSection } from './ImageTextSection'
import { PolaroidSection } from './PolaroidSection'
import { TextSection } from './TextSection'
import type { EditorialMemoryData } from './editorial-types'

interface Props {
  chapters: EditorialChapter<EditorialMemoryData>[]
  photoAlt: string
  // Carousel arrow labels — passed in rather than read via useTranslations
  // because this tree also renders on public portfolio pages, which have no
  // NextIntlClientProvider.
  scrollLeftLabel: string
  scrollRightLabel: string
  // Owner page injects the per-section toolbar here; public page omits it
  renderSectionFooter?: (memoryId: string, variant: EditorialSectionVariant) => ReactNode
}

function Section({
  memory,
  variant,
  photoAlt,
  scrollLeftLabel,
  scrollRightLabel,
}: {
  memory: EditorialMemoryData
  variant: EditorialSectionVariant
  photoAlt: string
  scrollLeftLabel: string
  scrollRightLabel: string
}) {
  switch (variant) {
    case 'hero':
      return <HeroSection memory={memory} photoAlt={photoAlt} />
    case 'imageLeft':
      return <ImageTextSection memory={memory} side="left" photoAlt={photoAlt} />
    case 'imageRight':
      return <ImageTextSection memory={memory} side="right" photoAlt={photoAlt} />
    case 'carousel':
      return (
        <CarouselSection
          memory={memory}
          photoAlt={photoAlt}
          scrollLeftLabel={scrollLeftLabel}
          scrollRightLabel={scrollRightLabel}
        />
      )
    case 'text':
      return <TextSection memory={memory} />
    case 'polaroid':
      return <PolaroidSection memory={memory} photoAlt={photoAlt} />
  }
}

export function EditorialChapters({
  chapters,
  photoAlt,
  scrollLeftLabel,
  scrollRightLabel,
  renderSectionFooter,
}: Props) {
  return (
    <div>
      {chapters.map((chapter) => (
        <section key={chapter.key}>
          <header className="mb-8 mt-16 animate-fade-in-up first:mt-8">
            {chapter.subtitle && (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground scrapbook:hidden">
                  {chapter.subtitle}
                </p>
                <Badge variant="stamp" className="hidden scrapbook:inline-flex">
                  {chapter.subtitle}
                </Badge>
              </>
            )}
            <h3 className="font-heading mt-1 text-3xl text-foreground">{chapter.title}</h3>
            <div className="mt-3 h-px w-16 bg-primary scrapbook:h-0 scrapbook:w-20 scrapbook:border-t-2 scrapbook:border-dashed scrapbook:border-terracotta-dark scrapbook:bg-transparent" />
          </header>

          <div className="space-y-16">
            {chapter.sections.map(({ memory, variant }, index) => (
              <div
                key={memory.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <Section
                  memory={memory}
                  variant={variant}
                  photoAlt={photoAlt}
                  scrollLeftLabel={scrollLeftLabel}
                  scrollRightLabel={scrollRightLabel}
                />
                {renderSectionFooter?.(memory.id, variant)}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
