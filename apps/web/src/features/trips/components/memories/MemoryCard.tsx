'use client'

import { useDeleteMemory, useUpdateMemory } from '@passe/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@passe/ui/alert-dialog'
import { Button, buttonVariants } from '@passe/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

interface MemoryCardData {
  id: string
  tripId: string
  isPublic: boolean
  note?: string | null
  media: { id: string; url: string }[]
  city?: string | null
  country?: string | null
}

interface Props {
  memory: MemoryCardData
}

export function MemoryCard({ memory }: Props) {
  const t = useTranslations('trips.memory_card')
  const updateMemory = useUpdateMemory()
  const deleteMemory = useDeleteMemory()
  const [deleteOpen, setDeleteOpen] = useState(false)
  // Which media item is shown large — extra photos render as a thumbnail strip
  const [activeIndex, setActiveIndex] = useState(0)

  const activeMedia = memory.media[activeIndex] ?? memory.media[0]

  function handleTogglePublic() {
    updateMemory.mutate({ id: memory.id, tripId: memory.tripId, isPublic: !memory.isPublic })
  }

  async function handleDelete() {
    await deleteMemory.mutateAsync({ id: memory.id, tripId: memory.tripId })
    setDeleteOpen(false)
  }

  return (
    <Card>
      {activeMedia && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={activeMedia.url}
            alt={t('photo_alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {memory.media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3">
          {memory.media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={t('photo_alt')}
              className={cn(
                'relative size-14 shrink-0 overflow-hidden rounded-md border',
                index === activeIndex ? 'border-primary' : 'border-border opacity-70',
              )}
            >
              <Image
                src={item.url}
                alt={t('photo_alt')}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
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
      <CardFooter className="justify-end gap-1">
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

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground"
                aria-label={t('delete')}
              />
            }
          >
            <Icon name="delete" size="sm" />
            {t('delete')}
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('delete_description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
                {t('delete_cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteMemory.isPending}
                isLoading={deleteMemory.isPending}
                onClick={handleDelete}
              >
                {t('delete_confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
