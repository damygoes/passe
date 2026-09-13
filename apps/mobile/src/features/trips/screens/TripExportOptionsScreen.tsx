import { canExportPdf } from '@passe/auth/plan-gates'
import { usePasseApi, useUser } from '@passe/hooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import {
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface KeepsakeCardProps {
  icon: IconName
  title: string
  description: string
  statusLabel: string
  statusVariant: BadgeVariant
  ctaLabel: string
  canExport: boolean
  loading?: boolean
  onPress: () => void
}

function KeepsakeCard({
  icon,
  title,
  description,
  statusLabel,
  statusVariant,
  ctaLabel,
  canExport,
  loading,
  onPress,
}: KeepsakeCardProps) {
  const { colors, spacing, fonts, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          gap: spacing[4],
          alignItems: 'center',
          backgroundColor: colors.popover,
          borderRadius: 26,
          padding: spacing[4] + 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        },
        preview: {
          width: 76,
          height: 96,
          borderRadius: 14,
          flexShrink: 0,
          backgroundColor: colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: { flex: 1, gap: spacing[1] },
        titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
        title: { fontFamily: fonts.display, fontSize: fontSizes.xl, color: colors.foreground },
        description: { fontSize: fontSizes.sm, lineHeight: 18, color: colors.mutedForeground },
        cta: { marginTop: spacing[2] },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  return (
    <View style={styles.card}>
      <View style={styles.preview}>
        <Icon name={icon} size="2xl" color={`${colors.foreground}40`} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Button
          size="sm"
          variant={canExport ? 'primary' : 'secondary'}
          fullWidth
          loading={loading}
          disabled={loading}
          onPress={onPress}
          style={styles.cta}
        >
          {ctaLabel}
        </Button>
      </View>
    </View>
  )
}

// Export picker sheet: Memory book (inline download + share), Zine, Postcard —
// all three Collector-gated via the shared canExportPdf plan gate. Restyled to
// the design handoff's horizontal keepsake-card list; the sheet route itself
// and every underlying export/download flow is unchanged.
export function TripExportOptionsScreen() {
  const t = useTranslations('trips.keepsakes')
  const tDetail = useTranslations('trips.detail')
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: user } = useUser()
  const { baseUrl, getToken } = usePasseApi()
  const { colors, spacing, fonts, fontSizes } = useTheme()
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const canExport = canExportPdf(user?.plan ?? 'free')
  const statusLabel = canExport ? t('status_ready') : t('status_locked')
  const statusVariant: BadgeVariant = canExport ? 'neutral' : 'outline'

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollContent: { padding: spacing[5], paddingTop: spacing[6], gap: spacing[4] },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[1],
        },
        title: { fontFamily: fonts.display, fontSize: fontSizes['2xl'], color: colors.foreground },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  async function handleDownloadPdf() {
    if (isDownloadingPdf) return
    if (!canExport) {
      router.push('/(app)/account/paywall')
      return
    }
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
          ? tDetail('export_share_unavailable')
          : tDetail('export_download_failed'),
      )
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('title')}</Text>
          <Badge variant={canExport ? 'shared' : 'neutral'}>
            {canExport ? t('badge_unlocked') : t('badge_locked')}
          </Badge>
        </View>

        {downloadError && <ErrorBanner message={downloadError} />}

        <KeepsakeCard
          icon="book-open"
          title={t('pdf_title')}
          description={tDetail('export_pdf_description')}
          statusLabel={statusLabel}
          statusVariant={statusVariant}
          ctaLabel={canExport ? t('pdf_cta') : t('locked_cta')}
          canExport={canExport}
          loading={isDownloadingPdf}
          onPress={handleDownloadPdf}
        />

        <KeepsakeCard
          icon="fold"
          title={t('zine_title')}
          description={tDetail('export_zine_description')}
          statusLabel={statusLabel}
          statusVariant={statusVariant}
          ctaLabel={canExport ? t('zine_cta') : t('locked_cta')}
          canExport={canExport}
          onPress={() =>
            canExport
              ? router.replace(`/(app)/trips/export-zine/${id}`)
              : router.push('/(app)/account/paywall')
          }
        />

        <KeepsakeCard
          icon="mail"
          title={t('postcard_title')}
          description={tDetail('export_postcard_description')}
          statusLabel={statusLabel}
          statusVariant={statusVariant}
          ctaLabel={canExport ? t('postcard_cta') : t('locked_cta')}
          canExport={canExport}
          onPress={() =>
            canExport
              ? router.replace(`/(app)/trips/export-postcard/${id}`)
              : router.push('/(app)/account/paywall')
          }
        />
      </ScrollView>
    </SafeAreaView>
  )
}
