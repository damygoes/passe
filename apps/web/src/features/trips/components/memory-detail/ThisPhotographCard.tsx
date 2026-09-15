'use client'

import { Link } from '@/i18n/navigation'
import { tripKeepsakesRoute } from '@/lib/routes'
import type { MemoryMedia } from '@passe/types/memory'
import { Button, buttonVariants } from '@passe/ui/button'
import { Card, CardContent } from '@passe/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DeletePhotoDialog } from './DeletePhotoDialog'
import { PhotoCaptionEditor } from './PhotoCaptionEditor'

interface Props {
  tripId: string
  media: MemoryMedia[]
  activePhoto: MemoryMedia
  selectedIndex: number
  isCover: boolean
  isPending: boolean
  onSetCover: (index: number) => void
  onSaveCaption: (index: number, caption: string) => void
  onDelete: (index: number) => void
}

// Per-photo content, kept strictly separate from MemoryInfoPane's
// memory-level content per the design spec's explicit boundary.
export function ThisPhotographCard({
  tripId,
  media,
  activePhoto,
  selectedIndex,
  isCover,
  isPending,
  onSetCover,
  onSaveCaption,
  onDelete,
}: Props) {
  const t = useTranslations('trips.memory_detail')
  const tMemoryCard = useTranslations('trips.memory_card')
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <Card className="mt-5.5 rounded-[22px]">
      <CardContent>
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {t('this_photograph')}
          </span>
          {media.length > 1 && (
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              {t('photo_position_short', { current: selectedIndex + 1, total: media.length })}
            </span>
          )}
        </div>

        {isEditingCaption ? (
          <PhotoCaptionEditor
            initialCaption={activePhoto.caption ?? ''}
            onSave={(caption) => {
              onSaveCaption(selectedIndex, caption)
              setIsEditingCaption(false)
            }}
            onCancel={() => setIsEditingCaption(false)}
          />
        ) : (
          activePhoto.caption && (
            <p className="mt-2 text-[14.5px] leading-relaxed">{activePhoto.caption}</p>
          )
        )}

        <div className="mt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8.5 rounded-full"
            disabled={isPending || isCover}
            onClick={() => onSetCover(selectedIndex)}
          >
            {isCover ? t('cover_photograph') : t('make_cover')}
          </Button>
          <Link
            href={tripKeepsakesRoute(tripId)}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'h-8.5 rounded-full',
            })}
          >
            {tMemoryCard('make_postcard')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('photo_options')}
                  className="ml-auto"
                />
              }
            >
              <Icon name="more" size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingCaption(true)}>
                {t('edit_caption')}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                {t('delete_photo')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      <DeletePhotoDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        isPending={isPending}
        onConfirm={() => {
          setIsDeleteOpen(false)
          onDelete(selectedIndex)
        }}
      />
    </Card>
  )
}
