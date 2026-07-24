import { canUseThemes } from '@passe/auth/plan-gates'
import { useUpdateUser } from '@passe/hooks'
import type { Plan, UserTheme } from '@passe/types/user'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useI18nContext } from '@/i18n/I18nProvider'
import { useTranslations } from '@/i18n/useTranslations'
import { lightColors, resolveLineHeight, scrapbookLightColors } from '@/theme'

interface AppearanceFormProps {
  theme: UserTheme
  plan: Plan
}

const THEME_OPTIONS: UserTheme[] = ['editorial', 'scrapbook']

// Swatch colors for the "Aa" preview tiles — pulled directly from the raw
// token sets (not useTheme()) so both options render their own look
// regardless of which theme is currently active.
const PREVIEW_COLORS: Record<UserTheme, { background: string; foreground: string }> = {
  editorial: { background: lightColors.background, foreground: lightColors.foreground },
  scrapbook: {
    background: scrapbookLightColors.background,
    foreground: scrapbookLightColors.foreground,
  },
}

export function AppearanceForm({ theme, plan }: AppearanceFormProps) {
  const { colors, spacing, borderRadius, fonts, fontSizes, fontWeights, lineHeights } = useTheme()
  const { locale } = useI18nContext()
  const t = useTranslations('account.appearance')
  const tErrors = useTranslations('account.errors')
  const { mutate, isPending, isError, variables } = useUpdateUser()
  const [success, setSuccess] = useState(false)
  const unlocked = canUseThemes(plan)

  const activeTheme = variables?.theme ?? theme

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[4] },
        grid: { flexDirection: 'column', gap: spacing[4] },
        card: { flex: 1 },
        headerColumn: { flex: 1, flexDirection: 'column' },
        preview: {
          width: '100%',
          height: 64,
          borderRadius: borderRadius.lg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        previewText: { fontSize: fontSizes['2xl'] },
        optionTitle: {
          marginVertical: spacing[3],
          fontFamily: fonts.heading,
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        badge: { position: 'absolute', top: spacing[3], right: spacing[3], zIndex: 1 },
        lockedRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          paddingVertical: spacing[2],
        },
        errorText: {
          fontSize: fontSizes.sm,
          color: colors.destructive,
        },
        lockedNote: {
          fontSize: fontSizes.sm,
          color: colors.mutedForeground,
          lineHeight: resolveLineHeight(fontSizes.sm, lineHeights.normal),
        },
        appearanceButton: {
          marginVertical: spacing[2],
        },
      }),
    [colors, spacing, borderRadius, fonts, fontSizes, fontWeights, lineHeights],
  )

  useEffect(() => {
    if (!success) return
    const id = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(id)
  }, [success])

  function selectTheme(next: UserTheme) {
    if (next === activeTheme || isPending) return
    setSuccess(false)
    mutate({ theme: next }, { onSuccess: () => setSuccess(true) })
  }

  function openBillingOnWeb() {
    void WebBrowser.openBrowserAsync(`${process.env.EXPO_PUBLIC_API_URL}/${locale}/billing`)
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {THEME_OPTIONS.map((option) => {
          const isLocked = option !== 'editorial' && !unlocked
          const isActive = activeTheme === option
          const preview = PREVIEW_COLORS[option]

          return (
            <Card key={option} size="sm" style={styles.card}>
              {isActive && <Badge style={styles.badge}>{t('current_label')}</Badge>}
              <CardHeader>
                <View style={styles.headerColumn}>
                  <View style={[styles.preview, { backgroundColor: preview.background }]}>
                    <Text
                      style={[
                        styles.previewText,
                        {
                          color: preview.foreground,
                          fontFamily: option === 'scrapbook' ? fonts.annotation : fonts.display,
                        },
                      ]}
                    >
                      Aa
                    </Text>
                  </View>
                  <Text style={styles.optionTitle}>{t(`${option}_label`)}</Text>
                </View>
              </CardHeader>
              <CardFooter>
                {isLocked ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.lockedRow}
                    onPress={openBillingOnWeb}
                  >
                    <Icon name="lock" size="sm" color={colors.mutedForeground} />
                    <Text style={styles.lockedNote}>{t('upgrade_cta')}</Text>
                  </Pressable>
                ) : (
                  <Button
                    size="sm"
                    variant={isActive ? 'secondary' : 'primary'}
                    fullWidth
                    disabled={isActive || isPending}
                    loading={isPending && variables?.theme === option}
                    onPress={() => selectTheme(option)}
                    style={styles.appearanceButton}
                  >
                    {isActive
                      ? t('current_label')
                      : t('select_cta', { theme: t(`${option}_label`) })}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </View>

      {isError && <Text style={styles.errorText}>{tErrors('update_failed')}</Text>}
      {!unlocked && <Text style={styles.lockedNote}>{t('locked_note')}</Text>}
    </View>
  )
}
