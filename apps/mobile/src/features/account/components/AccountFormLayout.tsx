import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'
import { resolveLineHeight } from '@/theme'

interface AccountFormLayoutProps {
  description?: string
  children: ReactNode
}

export function AccountFormLayout({ description, children }: AccountFormLayoutProps) {
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
        description: {
          fontFamily: fonts.body,
          fontSize: fontSizes.sm,
          lineHeight: resolveLineHeight(fontSizes.sm, lineHeights.normal),
          color: colors.mutedForeground,
        },
        body: { gap: spacing[4] },
      }),
    [colors, spacing, fonts, fontSizes, lineHeights],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.body}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
