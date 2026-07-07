import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

import type { IconName } from '@/components/ui/icon'
import { AccountMenuRow } from '@/features/account/components/AccountMenuRow'
import { buildLegalUrl, type LegalPageKey } from '@/features/account/utils/legalLinks'
import { useTheme } from '@/hooks/useTheme'
import { useI18nContext } from '@/i18n/I18nProvider'
import { useTranslations } from '@/i18n/useTranslations'

const LEGAL_ROWS: { key: LegalPageKey; icon: IconName; labelKey: string }[] = [
  { key: 'privacyPolicy', icon: 'shield', labelKey: 'privacy_policy' },
  { key: 'termsOfService', icon: 'document', labelKey: 'terms_of_service' },
  { key: 'impressum', icon: 'legal', labelKey: 'impressum' },
  { key: 'support', icon: 'help', labelKey: 'support' },
]

export function LegalSection() {
  const { locale } = useI18nContext()
  const { colors, spacing, fontSizes, fontWeights } = useTheme()
  const t = useTranslations('account.legal')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: { gap: spacing[1] },
        label: {
          fontSize: fontSizes.xs,
          fontWeight: fontWeights.medium,
          color: colors.mutedForeground,
          textTransform: 'uppercase',
          marginBottom: spacing[1],
        },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{t('title')}</Text>
      {LEGAL_ROWS.map((row) => (
        <AccountMenuRow
          key={row.key}
          icon={row.icon}
          label={t(row.labelKey)}
          trailingIcon="external-link"
          onPress={() => void WebBrowser.openBrowserAsync(buildLegalUrl(row.key, locale))}
        />
      ))}
    </View>
  )
}
