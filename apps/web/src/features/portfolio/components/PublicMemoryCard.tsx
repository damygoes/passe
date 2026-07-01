import { Card, CardContent, CardDescription, CardHeader } from '@passe/ui/card'
import Image from 'next/image'

interface MemoryData {
  id: string
  note?: string | null
  photoUrl?: string | null
  city?: string | null
  country?: string | null
}

interface Props {
  memory: MemoryData
}

export function PublicMemoryCard({ memory }: Props) {
  return (
    <Card>
      {memory.photoUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={memory.photoUrl}
            alt={memory.city ?? 'Memory photo'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        {(memory.city || memory.country) && (
          <CardDescription>{[memory.city, memory.country].filter(Boolean).join(', ')}</CardDescription>
        )}
      </CardHeader>
      {memory.note && (
        <CardContent>
          <p className="text-sm">{memory.note}</p>
        </CardContent>
      )}
    </Card>
  )
}
