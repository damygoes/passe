'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getBlurProps } from '@/lib/image-blur'
import { createMediaLoader } from '@/lib/media-image-loader'
import { useMemories } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@passe/ui/sheet'
import { Skeleton } from '@passe/ui/skeleton'
import { cn } from '@passe/utils'

const MAX_ZINE_SELECTION = 6

interface Props {
  tripId: string
}

function extractFilename(contentDisposition: string | null): string {
  const match = contentDisposition ? /filename="([^"]+)"/.exec(contentDisposition) : null
  return match?.[1] ?? 'zine.pdf'
}

export function ZineExportSheet({ tripId }: Props) {
  const t = useTranslations('trips.detail')
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const memoriesWithPhotos = memories.filter((memory) => memory.media.length > 0)

  function toggleSelection(memoryId: string) {
    setSelectedIds((current) => {
      if (current.includes(memoryId)) return current.filter((selected) => selected !== memoryId)
      if (current.length >= MAX_ZINE_SELECTION) return current
      return [...current, memoryId]
    })
  }

  async function handleGenerate() {
    setGenerateError(null)
    setIsGenerating(true)
    try {
      const res = await fetch(`/api/trips/${tripId}/zine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryIds: selectedIds }),
      })
      if (!res.ok) throw new Error('Failed to generate zine')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = extractFilename(res.headers.get('Content-Disposition'))
      link.click()
      URL.revokeObjectURL(url)

      setOpen(false)
      setSelectedIds([])
    } catch {
      setGenerateError(t('zine_generate_failed'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setGenerateError(null)
      }}
    >
      <SheetTrigger render={<Button variant="outline" size="sm" icon="camera" />}>
        {t('create_zine')}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>{t('zine_picker_title')}</SheetTitle>
          <SheetDescription>
            {t('zine_picker_description', { max: MAX_ZINE_SELECTION })}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isLoading && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <p className="text-sm text-destructive">{t('zine_memories_error')}</p>
          )}

          {!isLoading && !isError && memoriesWithPhotos.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('zine_no_photos')}</p>
          )}

          {!isLoading && !isError && memoriesWithPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {memoriesWithPhotos.map((memory) => {
                const cover = memory.media[0]
                const selectedPosition = selectedIds.indexOf(memory.id)
                const isSelected = selectedPosition !== -1
                const isDisabled = !isSelected && selectedIds.length >= MAX_ZINE_SELECTION

                return (
                  <Button
                    key={memory.id}
                    type="button"
                    variant="ghost"
                    disabled={isDisabled}
                    onClick={() => toggleSelection(memory.id)}
                    className={cn(
                      'relative h-auto w-full overflow-hidden rounded-lg p-0',
                      'aspect-square ring-2 ring-transparent',
                      isSelected && 'ring-terracotta',
                    )}
                  >
                    {cover && (
                      <Image
                        src={cover.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="120px"
                        {...getBlurProps(cover.placeholder)}
                        {...(cover.srcset ? { loader: createMediaLoader(cover.srcset) } : {})}
                      />
                    )}
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-medium text-aged-cream">
                        {selectedPosition + 1}
                      </span>
                    )}
                  </Button>
                )
              })}
            </div>
          )}
        </div>

        {generateError && <p className="px-4 text-sm text-destructive">{generateError}</p>}

        <SheetFooter className="flex-row items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t('zine_selection_count', { count: selectedIds.length, max: MAX_ZINE_SELECTION })}
          </span>
          <div className="flex gap-2">
            <SheetClose render={<Button variant="outline">{t('zine_cancel')}</Button>} />
            <Button
              disabled={selectedIds.length === 0 || isGenerating}
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              {t('zine_generate')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
