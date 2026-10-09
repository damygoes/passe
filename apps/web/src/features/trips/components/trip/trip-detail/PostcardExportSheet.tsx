'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { billingRoute } from '@/lib/routes'
import { canExportPdf } from '@passe/auth/plan-gates'
import { useMemories, useUser } from '@passe/hooks'
import { Button, buttonVariants } from '@passe/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@passe/ui/sheet'
import { Skeleton } from '@passe/ui/skeleton'
import { Textarea } from '@passe/ui/textarea'
import { cn } from '@passe/utils'

const POSTCARD_MESSAGE_MAX_LENGTH = 280

interface Props {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-selects this memory's photo, for callers that already know which one. */
  initialMemoryId?: string
}

function extractFilename(contentDisposition: string | null): string {
  const match = contentDisposition ? /filename="([^"]+)"/.exec(contentDisposition) : null
  return match?.[1] ?? 'postcard.pdf'
}

export function PostcardExportSheet({ tripId, open, onOpenChange, initialMemoryId }: Props) {
  const t = useTranslations('trips.detail')
  const tKeepsakes = useTranslations('trips.keepsakes')
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { data: user } = useUser()
  const [selectedId, setSelectedId] = useState<string | null>(initialMemoryId ?? null)
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  // Set when the server rejects the export with a 403, so a plan change
  // mid-session still lands on the upgrade path rather than a retry message.
  const [serverLocked, setServerLocked] = useState(false)

  // Re-seed the selection when the caller points at a different memory —
  // this component stays mounted across memory navigation, same reason
  // MemoryDetailContent resets its selectedIndex on memoryId.
  useEffect(() => {
    setSelectedId(initialMemoryId ?? null)
  }, [initialMemoryId])

  const memoriesWithPhotos = memories.filter((memory) => memory.media.length > 0)
  // Treat an unresolved user as unlocked — the entry point is already gated,
  // and flashing a paywall at a Collector while useUser() settles is worse
  // than relying on the server's 403 for the rare direct-open case.
  const isLocked = (user ? !canExportPdf(user.plan) : false) || serverLocked

  function resetState() {
    setSelectedId(initialMemoryId ?? null)
    setMessage('')
    setGenerateError(null)
    setServerLocked(false)
  }

  async function handleGenerate() {
    if (!selectedId) return
    setGenerateError(null)
    setIsGenerating(true)
    try {
      const res = await fetch(`/api/trips/${tripId}/postcard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId: selectedId, message: message.trim() || undefined }),
      })
      if (res.status === 403) {
        setServerLocked(true)
        return
      }
      if (!res.ok) throw new Error('Failed to generate postcard')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = extractFilename(res.headers.get('Content-Disposition'))
      link.click()
      URL.revokeObjectURL(url)

      onOpenChange(false)
      resetState()
    } catch {
      setGenerateError(t('postcard_generate_failed'))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) resetState()
      }}
    >
      <SheetContent side="bottom" className="max-h-[85vh]">
        {isGenerating && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 cursor-wait overflow-hidden rounded-[inherit] before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent motion-reduce:hidden"
          />
        )}
        <SheetHeader>
          <SheetTitle>{t('postcard_picker_title')}</SheetTitle>
          <SheetDescription>{t('postcard_picker_description')}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          {isLoading && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <p className="text-sm text-destructive">{t('postcard_memories_error')}</p>
          )}

          {!isLoading && !isError && memoriesWithPhotos.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('postcard_no_photos')}</p>
          )}

          {!isLoading && !isError && memoriesWithPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {memoriesWithPhotos.map((memory) => {
                const cover = memory.media[0]
                const isSelected = selectedId === memory.id

                return (
                  <Button
                    key={memory.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedId(memory.id)}
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
                  </Button>
                )
              })}
            </div>
          )}

          {!isLoading && !isError && memoriesWithPhotos.length > 0 && (
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t('postcard_message_placeholder')}
              maxLength={POSTCARD_MESSAGE_MAX_LENGTH}
            />
          )}
        </div>

        {isLocked && (
          <div
            role="alert"
            className="mx-4 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
          >
            {t('postcard_locked_message')}
          </div>
        )}

        {generateError && <p className="px-4 text-sm text-destructive">{generateError}</p>}

        {!isLocked && !selectedId && memoriesWithPhotos.length > 0 && (
          <p className="px-4 text-sm text-muted-foreground">{t('postcard_select_hint')}</p>
        )}

        <SheetFooter className="flex-row items-center justify-between">
          <SheetClose render={<Button variant="outline">{t('postcard_cancel')}</Button>} />
          {isLocked ? (
            <Link href={billingRoute('postcard')} className={cn(buttonVariants())}>
              {tKeepsakes('locked_cta')}
            </Link>
          ) : (
            <Button
              disabled={!selectedId || isGenerating}
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              {t('postcard_generate')}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
