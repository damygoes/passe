import { formatTripDateFull } from '@passe/utils'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
}

export function TextSection({ memory }: Props) {
  const meta = memoryMetaLabel(memory)

  return (
    <div className="mx-auto max-w-prose py-4 text-center">
      {memory.note && (
        <p className="font-display text-[26px] leading-[1.35] text-foreground italic sm:text-[28px]">
          &ldquo;{memory.note}&rdquo;
        </p>
      )}
      <p className="mt-4 font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
        {[meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join(' · ')}
      </p>
    </div>
  )
}
