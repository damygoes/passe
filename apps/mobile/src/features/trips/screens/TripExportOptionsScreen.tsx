import { canExportPdf } from '@passe/auth/plan-gates'
import { usePasseApi, useUser } from '@passe/hooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'
import { Spinner } from '@/components/ui/spinner'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import {
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// Export formSheet: Memory Book (inline download + share), Zine, Postcard.
// All three are Collector-gated via the shared canExportPdf plan gate.
export function TripExportOptionsScreen() {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: user } = useUser()
  const { baseUrl, getToken } = usePasseApi()
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = useTheme()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const canExport = canExportPdf(user?.plan ?? 'free')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: spacing[4],
          paddingTop: spacing[6],
          gap: spacing[1],
          backgroundColor: colors.background,
        },
        title: {
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
          paddingHorizontal: spacing[3],
          paddingBottom: spacing[2],
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[3],
          borderRadius: borderRadius.lg,
        },
        rowPressed: { backgroundColor: colors.muted },
        rowDisabled: { opacity: 0.5 },
        rowText: { flex: 1, gap: 2 },
        rowLabel: { fontSize: fontSizes.base, color: colors.foreground },
        rowDescription: { fontSize: fontSizes.sm, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, fontWeights, borderRadius],
  )

  async function handleDownloadPdf() {
    if (isDownloadingPdf) return
    setDownloadError(null)
    setIsDownloadingPdf(true)
    try {
      await downloadTripExport({
        path: `/api/trips/${id}/pdf`,
        fallbackFilename: 'memory-book.pdf',
        baseUrl,
        getToken,
      })
    } catch (err) {
      setDownloadError(
        err instanceof ShareUnavailableError
          ? t('export_share_unavailable')
          : t('export_download_failed'),
      )
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  function renderRow(options: {
    icon: IconName
    label: string
    description: string
    onPress: () => void
    loading?: boolean
  }) {
    return (
      <Pressable
        disabled={!canExport || isDownloadingPdf}
        onPress={options.onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed,
          !canExport && styles.rowDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canExport }}
      >
        <Icon name={options.icon} size="md" color={colors.mutedForeground} />
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{options.label}</Text>
          <Text style={styles.rowDescription}>{options.description}</Text>
        </View>
        {options.loading ? (
          <Spinner />
        ) : !canExport ? (
          <Badge variant="outline">{t('collector_badge')}</Badge>
        ) : (
          <Icon name="chevron-right" size="sm" color={colors.mutedForeground} />
        )}
      </Pressable>
    )
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('export_menu_trigger')}</Text>

        {downloadError && <ErrorBanner message={downloadError} />}

        {renderRow({
          icon: 'download',
          label: t('download_pdf'),
          description: t('export_pdf_description'),
          onPress: handleDownloadPdf,
          loading: isDownloadingPdf,
        })}

        {renderRow({
          icon: 'camera',
          label: t('create_zine'),
          description: t('export_zine_description'),
          onPress: () => router.replace(`/(app)/trips/export-zine/${id}`),
        })}

        {renderRow({
          icon: 'mail',
          label: t('create_postcard'),
          description: t('export_postcard_description'),
          onPress: () => router.replace(`/(app)/trips/export-postcard/${id}`),
        })}
      </View>
    </SafeAreaView>
  )
}
