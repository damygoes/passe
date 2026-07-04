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
        <p className="font-heading text-2xl italic leading-relaxed text-foreground">
          {memory.note}
        </p>
      )}
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {[meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join(' · ')}
      </p>
    </div>
  )
}
