'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader } from '@passe/ui/card'

interface MemoryCardData {
  id: string
  note?: string | null
  photoUrl?: string | null
  city?: string | null
  country?: string | null
}

interface Props {
  memory: MemoryCardData
}

export function MemoryCard({ memory }: Props) {
  const t = useTranslations('trips.memory_card')

  return (
    <Card>
      {memory.photoUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={memory.photoUrl}
            alt={t('photo_alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        {(memory.city || memory.country) && (
          <CardDescription>
            {[memory.city, memory.country].filter(Boolean).join(', ')}
          </CardDescription>
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
