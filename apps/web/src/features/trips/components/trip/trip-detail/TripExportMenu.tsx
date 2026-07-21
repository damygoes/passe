'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@passe/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import { PostcardExportSheet } from './PostcardExportSheet'
import { ZineExportSheet } from './ZineExportSheet'

interface Props {
  tripId: string
  canExport: boolean
}

export function TripExportMenu({ tripId, canExport }: Props) {
  const t = useTranslations('trips.detail')
  const [zineSheetOpen, setZineSheetOpen] = useState(false)
  const [postcardSheetOpen, setPostcardSheetOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" icon="download">
              {t('export_menu_trigger')}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-60">
          {canExport ? (
            <DropdownMenuItem render={<a href={`/api/trips/${tripId}/pdf`} />}>
              <Icon name="download" size="xs" aria-hidden="true" />
              {t('download_pdf')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              {t('download_pdf')}
              <DropdownMenuShortcut>{t('collector_badge')}</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {canExport ? (
            <DropdownMenuItem onClick={() => setZineSheetOpen(true)}>
              <Icon name="camera" size="xs" aria-hidden="true" />
              {t('create_zine')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              {t('create_zine')}
              <DropdownMenuShortcut>{t('collector_badge')}</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          {canExport ? (
            <DropdownMenuItem onClick={() => setPostcardSheetOpen(true)}>
              <Icon name="mail" size="xs" aria-hidden="true" />
              {t('create_postcard')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              {t('create_postcard')}
              <DropdownMenuShortcut>{t('collector_badge')}</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ZineExportSheet tripId={tripId} open={zineSheetOpen} onOpenChange={setZineSheetOpen} />
      <PostcardExportSheet
        tripId={tripId}
        open={postcardSheetOpen}
        onOpenChange={setPostcardSheetOpen}
      />
    </>
  )
}
