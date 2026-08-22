import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

import { Spinner } from '@/components/ui/spinner'
import { buildLegalUrl } from '@/features/account/utils/legalLinks'
import { useTheme } from '@/hooks/useTheme'
import { useI18nContext } from '@/i18n/I18nProvider'
import { useTranslations } from '@/i18n/useTranslations'

interface PaywallFooterLinksProps {
  restoreLabel: string
  onRestorePress: () => void
  isRestoring: boolean
  restoreDisabled: boolean
}

export function PaywallFooterLinks({
  restoreLabel,
  onRestorePress,
  isRestoring,
  restoreDisabled,
}: PaywallFooterLinksProps) {
  const { locale } = useI18nContext()
  const { colors, spacing, fontSizes } = useTheme()
  const t = useTranslations('account.legal')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing[2],
        },
        link: { fontSize: fontSizes.xs, color: colors.primary, fontWeight: '500' },
        linkDisabled: { color: colors.mutedForeground },
        separator: { fontSize: fontSizes.xs, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes],
  )

  return (
    <View style={styles.row}>
      {isRestoring ? (
        <Spinner size="sm" />
      ) : (
        <Text
          style={[styles.link, restoreDisabled && styles.linkDisabled]}
          onPress={restoreDisabled ? undefined : onRestorePress}
        >
          {restoreLabel}
        </Text>
      )}
      <Text style={styles.separator}>·</Text>
      <Text
        style={styles.link}
        onPress={() => void WebBrowser.openBrowserAsync(buildLegalUrl('termsOfService', locale))}
      >
        {t('terms_of_service')}
      </Text>
      <Text style={styles.separator}>·</Text>
      <Text
        style={styles.link}
        onPress={() => void WebBrowser.openBrowserAsync(buildLegalUrl('privacyPolicy', locale))}
      >
        {t('privacy_policy')}
      </Text>
    </View>
  )
}
