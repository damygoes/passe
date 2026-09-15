import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/hooks/useTheme'
import { resolveLineHeight } from '@/theme'

interface AuthScreenLayoutProps {
  heading: string
  subheading: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthScreenLayout({ heading, subheading, children, footer }: AuthScreenLayoutProps) {
  const { colors, spacing, fonts, fontSizes, fontWeights, lineHeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        flex: { flex: 1 },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          padding: spacing[6],
          gap: spacing[6],
        },
        headingGroup: { gap: spacing[1] },
        heading: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.semibold,
          lineHeight: resolveLineHeight(fontSizes['2xl'], lineHeights.tight),
          color: colors.foreground,
        },
        subheading: {
          fontFamily: fonts.body,
          fontSize: fontSizes.sm,
          lineHeight: resolveLineHeight(fontSizes.sm, lineHeights.normal),
          color: colors.mutedForeground,
        },
        body: { gap: spacing[4] },
        footer: { alignItems: 'center' },
      }),
    [colors, spacing, fonts, fontSizes, fontWeights, lineHeights],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headingGroup}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subheading}>{subheading}</Text>
          </View>
          <View style={styles.body}>{children}</View>
          {footer && <View style={styles.footer}>{footer}</View>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

interface OrDividerProps {
  label: string
}

export function OrDivider({ label }: OrDividerProps) {
  const { colors, spacing, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
        label: { fontSize: fontSizes.xs, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes],
  )

  return (
    <View style={styles.row}>
      <Separator style={{ flex: 1 }} />
      <Text style={styles.label}>{label}</Text>
      <Separator style={{ flex: 1 }} />
    </View>
  )
}
