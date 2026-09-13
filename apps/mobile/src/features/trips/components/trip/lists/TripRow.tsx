import { colors as brandColors } from '@passe/theme'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { PressableScale } from '@/components/ui/pressable-scale'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface TripRowData {
  id: string
  title: string
  coverImageUrl?: string | null
}

interface TripRowProps {
  trip: TripRowData
  meta: string
  sub: string
  isShared: boolean
  showDivider?: boolean
  onPress?: () => void
}

const sandyBeige = brandColors.sandyBeige.DEFAULT
const cream = brandColors.agedCream.DEFAULT
const terracotta = brandColors.terracotta.DEFAULT
const espresso = brandColors.darkEspresso.DEFAULT

export function TripRow({ trip, meta, sub, isShared, showDivider = true, onPress }: TripRowProps) {
  const t = useTranslations('trips.home')
  const { colors, fonts, spacing, fontSizes, fontWeights, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3] + 2,
          paddingVertical: spacing[4],
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: colors.border,
        },
        thumb: {
          width: 82,
          height: 82,
          borderRadius: borderRadius.xl + spacing[1],
          overflow: 'hidden',
          backgroundColor: colors.muted,
        },
        thumbFallback: { alignItems: 'center', justifyContent: 'center' },
        thumbInitial: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.bold,
          color: `${espresso}59`,
        },
        content: { flex: 1, minWidth: 0 },
        title: { fontFamily: fonts.display, fontSize: fontSizes.xl, color: colors.foreground },
        meta: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 0.6,
          color: colors.mutedForeground,
          marginTop: spacing[1] + 2,
        },
        sub: { fontSize: fontSizes.sm, color: colors.mutedForeground, marginTop: spacing[1] + 2 },
      }),
    [colors, fonts, spacing, fontSizes, fontWeights, borderRadius, showDivider],
  )

  return (
    <PressableScale onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.thumb}>
          {trip.coverImageUrl ? (
            <Image
              source={{ uri: trip.coverImageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.thumbFallback]}>
              <LinearGradient
                colors={[sandyBeige, cream, `${terracotta}4D`]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.thumbInitial}>{trip.title.trim().charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.meta}>{meta}</Text>
          {sub ? (
            <Text style={styles.sub} numberOfLines={1}>
              {sub}
            </Text>
          ) : null}
        </View>
        <Badge variant={isShared ? 'shared' : 'private'}>
          {isShared ? t('shared_tag') : t('private_tag')}
        </Badge>
      </View>
    </PressableScale>
  )
}
