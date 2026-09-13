import { useRouter } from 'expo-router'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { resolveLineHeight } from '@/theme'

interface AccountFormLayoutProps {
  title?: string
  description?: string
  children: ReactNode
  /** Defaults to router.back() — override when the caller knows a more
   *  reliable or more specific destination (e.g. a fixed parent screen). */
  onClose?: () => void
}

// Every screen using this layout is presented as a formSheet with its native
// header disabled (headers don't render inside formSheet presentations), so
// the sheet's drag-to-dismiss grabber was the only way out — not discoverable
// enough on its own. This renders an explicit close button so there's always
// a guaranteed way back, matching the title/description row it already owns.
export function AccountFormLayout({
  title,
  description,
  children,
  onClose,
}: AccountFormLayoutProps) {
  const router = useRouter()
  const tCommon = useTranslations('common')
  const handleClose = onClose ?? (() => router.back())
  const { colors, spacing, fonts, fontSizes, lineHeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        flex: { flex: 1 },
        scrollContent: {
          flexGrow: 1,
          padding: spacing[6],
          gap: spacing[6],
        },
        headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
        header: { flex: 1, gap: spacing[1] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes.xl,
          lineHeight: resolveLineHeight(fontSizes.xl, lineHeights.tight),
          color: colors.foreground,
        },
        description: {
          fontFamily: fonts.body,
          fontSize: fontSizes.sm,
          lineHeight: resolveLineHeight(fontSizes.sm, lineHeights.normal),
          color: colors.mutedForeground,
        },
        closeButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.muted,
        },
        body: { gap: spacing[4] },
      }),
    [colors, spacing, fonts, fontSizes, lineHeights],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.headerRow}>
            {(title || description) && (
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {description && <Text style={styles.description}>{description}</Text>}
              </View>
            )}
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel={tCommon('cancel')}
              hitSlop={8}
              style={styles.closeButton}
            >
              <Icon name="close" size="sm" color={colors.mutedForeground} />
            </Pressable>
          </View>
          <View style={styles.body}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
