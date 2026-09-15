import { colors as brandColors } from '@passe/theme'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// Bare "é" mark, same path data as @passe/ui's Logo (variant="mark") — no
// PNG asset carries a transparent background at brand-mark fidelity, so
// this draws the actual brand vector instead of compositing a raster cut.
const MARK_E_PATH =
  'M28.8 46.7Q37.6 46.7 42.65 51.85 47.7 57 47.7 69.1L16.4 69.1 16.2 67.2 33.1 67.2Q33.2 62.3 32.7 58.15 32.2 54 31.1 51.5 30 49 28.1 49 25.4 49 23.7 53.25 22 57.5 21.5 67.8L21.9 68.6Q21.8 69.6 21.8 70.6 21.8 71.6 21.8 72.7 21.8 79.7 23.55 83.6 25.3 87.5 27.95 89 30.6 90.5 33.3 90.5 34.7 90.5 36.65 90.1 38.6 89.7 40.9 88.25 43.2 86.8 45.4 83.8L47.1 84.4Q45.9 88.4 43.25 92.35 40.6 96.3 36.4 98.85 32.2 101.4 26.2 101.4 19.8 101.4 14.55 98.8 9.3 96.2 6.2 90.2 3.1 84.2 3.1 74.1 3.1 64.5 6.5 58.45 9.9 52.4 15.75 49.55 21.6 46.7 28.8 46.7Z'

export function WelcomeScreen() {
  const t = useTranslations('auth.welcome')
  const router = useRouter()
  const { colors, spacing, fonts, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        content: { flex: 1, paddingHorizontal: spacing[6], paddingBottom: spacing[6] },
        coverWrap: {
          height: 330,
          marginTop: spacing[2],
          alignItems: 'center',
          justifyContent: 'center',
        },
        markCol: {
          alignItems: 'center',
        },
        accent: {
          width: 64,
          height: 20,
          borderRadius: 10,
          backgroundColor: brandColors.terracotta.DEFAULT,
          marginBottom: -80,
          transform: [{ translateX: 18 }, { rotate: '-35deg' }],
        },
        title: {
          fontFamily: fonts.display,
          fontSize: 52,
          lineHeight: 56,
          color: colors.foreground,
          marginTop: spacing[8],
        },
        tagline: {
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: fontSizes.xl,
          color: colors.mutedForeground,
          marginTop: spacing[2],
        },
        body: {
          fontSize: fontSizes.sm,
          lineHeight: 22,
          color: colors.mutedForeground,
          marginTop: spacing[4],
          maxWidth: 300,
        },
        spacer: { flexGrow: 1, minHeight: spacing[8] },
        actions: { gap: spacing[3] },
        caption: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          marginTop: spacing[2],
        },
        captionDot: {
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: brandColors.deepOlive.DEFAULT,
        },
        captionLabel: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.coverWrap}>
          <View style={styles.markCol}>
            <View style={styles.accent} />
            <Svg width={140} height={300} viewBox="21.5 3.5 21 45">
              <Path
                transform="translate(21.33 5) scale(0.42)"
                d={MARK_E_PATH}
                fill={colors.foreground}
              />
            </Svg>
          </View>
        </View>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.tagline}>{t('tagline')}</Text>
        <Text style={styles.body}>{t('body')}</Text>
        <View style={styles.spacer} />
        <View style={styles.actions}>
          <Button size="lg" fullWidth onPress={() => router.push('/(auth)/sign-up')}>
            {t('cta_primary')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/sign-in')}
          >
            {t('cta_secondary')}
          </Button>
          <View style={styles.caption}>
            <View style={styles.captionDot} />
            <Text style={styles.captionLabel}>{t('caption_private')}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
