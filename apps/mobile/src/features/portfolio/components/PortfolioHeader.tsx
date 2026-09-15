import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface PortfolioHeaderUser {
  username: string
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
}

interface PortfolioHeaderProps {
  user: PortfolioHeaderUser
  tripCount: number
  countriesCount: number
  citiesCount: number
}

export function PortfolioHeader({
  user,
  tripCount,
  countriesCount,
  citiesCount,
}: PortfolioHeaderProps) {
  const t = useTranslations('portfolio')
  const { colors, spacing, fonts, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        urlRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        url: {
          fontSize: fontSizes.xs,
          letterSpacing: 1,
          color: colors.mutedForeground,
        },
        center: { alignItems: 'center', marginTop: spacing[6] },
        name: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          color: colors.foreground,
          marginTop: spacing[4],
          textAlign: 'center',
        },
        bio: {
          fontSize: fontSizes.sm,
          color: colors.mutedForeground,
          textAlign: 'center',
          marginTop: spacing[2],
          maxWidth: 280,
        },
        statsRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: spacing[8],
          marginTop: spacing[6],
          paddingVertical: spacing[4],
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
        },
        stat: { alignItems: 'center' },
        statValue: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          color: colors.foreground,
        },
        statLabel: {
          fontSize: fontSizes.xs,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
          marginTop: spacing[1],
        },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  const stats = [
    { key: 'trips', value: tripCount, label: t('stat_trips_label', { count: tripCount }) },
    {
      key: 'countries',
      value: countriesCount,
      label: t('stat_countries_label', { count: countriesCount }),
    },
    { key: 'cities', value: citiesCount, label: t('stat_cities_label', { count: citiesCount }) },
  ]

  return (
    <View>
      <View style={styles.urlRow}>
        <Text style={styles.url}>{t('public_url', { username: user.username })}</Text>
        <Badge variant="neutral">{t('public_badge')}</Badge>
      </View>
      <View style={styles.center}>
        <Avatar size="xl">
          <AvatarFallback>
            {user.displayName
              .split(' ')
              .map((name) => name[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
          {user.avatarUrl && <AvatarImage source={{ uri: user.avatarUrl }} />}
        </Avatar>
        <Text style={styles.name}>{user.displayName}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        {tripCount > 0 && (
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.key} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
