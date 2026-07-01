'use client'

import { useUpdateMemory } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface MemoryCardData {
  id: string
  tripId: string
  isPublic: boolean
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
  const updateMemory = useUpdateMemory()

  function handleTogglePublic() {
    updateMemory.mutate({ id: memory.id, tripId: memory.tripId, isPublic: !memory.isPublic })
  }

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
      <CardFooter className="justify-end">
        <button
          onClick={handleTogglePublic}
          disabled={updateMemory.isPending}
          aria-label={memory.isPublic ? t('make_private') : t('make_public')}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'gap-1.5 text-xs text-muted-foreground',
          )}
        >
          <Icon
            name={updateMemory.isPending ? 'loading' : memory.isPublic ? 'eye' : 'eye-off'}
            size="sm"
            className={updateMemory.isPending ? 'animate-spin' : undefined}
          />
          {memory.isPublic ? t('public_label') : t('private_label')}
        </button>
      </CardFooter>
    </Card>
  )
}
