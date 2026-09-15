import { colors as brandColors } from '@passe/theme'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// No dedicated marketing photo asset is bundled on mobile yet — reuse the
// paywall hero image (the only bundled wide travel photo) with the same
// warm scrim treatment used there, rather than introducing a new asset.
const cover = require('../../../../assets/images/paywall-hero.jpg')

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
          borderRadius: 28,
          overflow: 'hidden',
          marginTop: spacing[2],
          backgroundColor: colors.muted,
        },
        cover: { width: '100%', height: '100%', opacity: 0.92 },
        coverWash: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `${brandColors.agedCream.DEFAULT}26`,
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
          <Image source={cover} style={styles.cover} contentFit="cover" />
          <View style={styles.coverWash} pointerEvents="none" />
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
