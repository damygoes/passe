import { canExportPdf } from '@passe/auth/plan-gates'
import { usePasseApi, useUser } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import {
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'

interface TripExportMenuProps {
  tripId: string
  /** Surfaces download failures — rendered by the parent (e.g. as an ErrorBanner) */
  onError: (message: string | null) => void
}

export function TripExportMenu({ tripId, onError }: TripExportMenuProps) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { colors } = useTheme()
  const { data: user } = useUser()
  const { baseUrl, getToken } = usePasseApi()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const canExport = canExportPdf(user?.plan ?? 'free')

  async function handleDownloadPdf() {
    if (isDownloadingPdf) return
    onError(null)
    setIsDownloadingPdf(true)
    try {
      await downloadTripExport({
        path: `/api/trips/${tripId}/pdf`,
        fallbackFilename: 'memory-book.pdf',
        baseUrl,
        getToken,
      })
    } catch (err) {
      onError(
        err instanceof ShareUnavailableError
          ? t('export_share_unavailable')
          : t('export_download_failed'),
      )
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* The trigger supplies its own Pressable — render the Button purely as visuals */}
        <View pointerEvents="none">
          <Button variant="secondary" size="sm" loading={isDownloadingPdf}>
            {t('export_menu_trigger')}
          </Button>
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={!canExport || isDownloadingPdf}
          trailing={canExport ? undefined : t('collector_badge')}
          icon={<Icon name="download" size="sm" color={colors.mutedForeground} />}
          onPress={handleDownloadPdf}
        >
          {t('download_pdf')}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canExport}
          trailing={canExport ? undefined : t('collector_badge')}
          icon={<Icon name="camera" size="sm" color={colors.mutedForeground} />}
          onPress={() => router.push(`/(app)/trips/export-zine/${tripId}`)}
        >
          {t('create_zine')}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canExport}
          trailing={canExport ? undefined : t('collector_badge')}
          icon={<Icon name="mail" size="sm" color={colors.mutedForeground} />}
          onPress={() => router.push(`/(app)/trips/export-postcard/${tripId}`)}
        >
          {t('create_postcard')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
