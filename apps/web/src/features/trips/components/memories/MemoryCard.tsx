'use client'

import { useTranslations } from 'next-intl'
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
      {memory.photoUrl && <img src={memory.photoUrl} alt={t('photo_alt')} />}
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
