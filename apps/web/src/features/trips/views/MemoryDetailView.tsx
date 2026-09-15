'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { MemoryGalleryPane } from '@/features/trips/components/memory-detail/MemoryGalleryPane'
import { MemoryInfoPane } from '@/features/trips/components/memory-detail/MemoryInfoPane'
import { ThisPhotographCard } from '@/features/trips/components/memory-detail/ThisPhotographCard'
import { useAddMemoryPhotos } from '@/features/trips/components/memory-detail/useAddMemoryPhotos'
import { getPublicMemorySlots } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useUpdateMemory, useUser } from '@passe/hooks'
import type { CreateMemoryMedia, Memory } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'
import { Skeleton } from '@passe/ui/skeleton'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface Props {
  tripId: string
  memoryId: string
}

function toCreateMemoryMedia(photo: Memory['media'][number]): CreateMemoryMedia {
  return {
    url: photo.url,
    mediaType: photo.mediaType,
    width: photo.width,
    height: photo.height,
    caption: photo.caption,
    capturedAt: photo.capturedAt,
  }
}

export function MemoryDetailView({ tripId, memoryId }: Props) {
  const t = useTranslations('trips.memory_card')
  const { data: trip } = useTrip(tripId)
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { data: user } = useUser()

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Skeleton className="h-[420px] w-full rounded-none lg:h-full" />
        <div className="p-11">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-2/3" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
      </div>
    )
  }

  const memory = memories.find((item) => item.id === memoryId)
  if (isError || !memory) {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">{t('delete_failed')}</p>
      </div>
    )
  }

  const otherPublicCount = memories.filter((item) => item.id !== memory.id && item.isPublic).length
  const slots = user ? getPublicMemorySlots(user.plan, otherPublicCount) : null

  return (
    <MemoryDetailContent
      tripId={tripId}
      memoryId={memoryId}
      trip={trip}
      memory={memory}
      slots={slots}
      photoAlt={t('photo_alt')}
    />
  )
}

interface ContentProps {
  tripId: string
  memoryId: string
  trip: Trip | undefined
  memory: Memory
  slots: ReturnType<typeof getPublicMemorySlots> | null
  photoAlt: string
}

// Owns selection state and every per-photo mutation. Split out from
// MemoryDetailView so every hook here (including useAddMemoryPhotos, which
// needs a guaranteed Memory) is called unconditionally on every render —
// the parent's loading/error guards run before this component ever mounts.
function MemoryDetailContent({ tripId, memoryId, trip, memory, slots, photoAlt }: ContentProps) {
  const updateMemory = useUpdateMemory()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Reset selection when navigating to a different memory.
  useEffect(() => {
    setSelectedIndex(0)
  }, [memoryId])

  const {
    inputRef,
    openPicker,
    handleFilesChange,
    error: uploadError,
  } = useAddMemoryPhotos({
    tripId,
    memory,
    onAdded: (firstNewIndex) => setSelectedIndex(firstNewIndex),
  })

  const media = memory.media
  const clampedIndex = media.length > 0 ? Math.min(selectedIndex, media.length - 1) : 0
  const activePhoto = media[clampedIndex]
  const canPublish =
    memory.isPublic || (slots ? !slots.isUnlimited && (slots.remaining ?? 0) > 0 : true)

  function selectPhoto(index: number) {
    if (media.length === 0) return
    setSelectedIndex(((index % media.length) + media.length) % media.length)
  }
  const prevPhoto = () => selectPhoto(clampedIndex - 1)
  const nextPhoto = () => selectPhoto(clampedIndex + 1)

  function setCover(index: number) {
    if (index === 0) return
    const reordered = [media[index]!, ...media.filter((_, i) => i !== index)]
    updateMemory.mutate({ tripId, id: memory.id, media: reordered.map(toCreateMemoryMedia) })
    setSelectedIndex(0)
  }

  function saveCaption(index: number, caption: string) {
    const next = media.map((item, i) =>
      i === index ? { ...item, caption: caption || null } : item,
    )
    updateMemory.mutate({ tripId, id: memory.id, media: next.map(toCreateMemoryMedia) })
  }

  function deletePhoto(index: number) {
    const next = media.filter((_, i) => i !== index)
    updateMemory.mutate({ tripId, id: memory.id, media: next.map(toCreateMemoryMedia) })
    setSelectedIndex((current) => Math.min(current, Math.max(next.length - 1, 0)))
  }

  return (
    <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleFilesChange}
      />

      <MemoryGalleryPane
        memory={memory}
        media={media}
        activePhoto={activePhoto}
        selectedIndex={clampedIndex}
        onSelect={selectPhoto}
        onPrev={prevPhoto}
        onNext={nextPhoto}
        onAddPhotos={openPicker}
        photoAlt={photoAlt}
      />

      <FadeIn className="overflow-auto p-11">
        <MemoryInfoPane
          tripId={tripId}
          trip={trip}
          memory={memory}
          slots={slots}
          canPublish={canPublish}
          isPublicPending={updateMemory.isPending}
          onTogglePublic={(checked) =>
            updateMemory.mutate({ tripId, id: memory.id, isPublic: checked })
          }
          onAddPhotos={openPicker}
        />

        {uploadError && <p className="mt-3 text-xs text-destructive">{uploadError}</p>}

        {activePhoto && (
          <ThisPhotographCard
            tripId={tripId}
            media={media}
            activePhoto={activePhoto}
            selectedIndex={clampedIndex}
            isCover={clampedIndex === 0}
            isPending={updateMemory.isPending}
            onSetCover={setCover}
            onSaveCaption={saveCaption}
            onDelete={deletePhoto}
          />
        )}
      </FadeIn>
    </div>
  )
}
