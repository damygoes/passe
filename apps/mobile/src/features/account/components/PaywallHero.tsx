import { colors as brandColors } from '@passe/theme'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { LinearGradient } from '@/components/ui/linear-gradient'
import { useTheme } from '@/hooks/useTheme'

interface PaywallHeroProps {
  title: string
  subtitle: string
}

// The scrim sits on the hero photo, so it uses fixed brand inks rather than
// mode-dependent semantic colors — same rationale as TripCard.
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT

export function PaywallHero({ title, subtitle }: PaywallHeroProps) {
  const { fonts, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: { height: 320, overflow: 'hidden' },
        cover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        content: { flex: 1, justifyContent: 'flex-end', padding: spacing[6], gap: spacing[2] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          fontWeight: fontWeights.bold,
          color: cream,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        },
        subtitle: {
          fontSize: fontSizes.base,
          color: `${cream}E6`,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        },
      }),
    [fonts, spacing, fontSizes, fontWeights],
  )

  return (
    <View style={styles.hero}>
      <Image
        source={require('../../../../assets/images/paywall-hero.jpg')}
        style={styles.cover}
        contentFit="cover"
      />
      <LinearGradient
        colors={[`${espresso}00`, `${espresso}80`, `${espresso}D9`]}
        style={styles.scrim}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  )
}
