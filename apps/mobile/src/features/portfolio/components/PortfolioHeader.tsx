import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface PortfolioHeaderUser {
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
}

interface PortfolioHeaderProps {
  user: PortfolioHeaderUser
  tripCount: number
}

export function PortfolioHeader({ user, tripCount }: PortfolioHeaderProps) {
  const t = useTranslations('portfolio')
  const { colors, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingBottom: spacing[6],
        },
        info: { flex: 1, gap: spacing[1] },
        eyebrow: {
          fontSize: fontSizes.xs,
          color: colors.mutedForeground,
          textTransform: 'uppercase',
          letterSpacing: 2,
        },
        name: {
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        bio: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        badgeRow: { flexDirection: 'row', marginTop: spacing[2] },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <View style={styles.container}>
      <Avatar size="lg">
        <AvatarFallback>{initials}</AvatarFallback>
        {user.avatarUrl && <AvatarImage source={{ uri: user.avatarUrl }} />}
      </Avatar>
      <View style={styles.info}>
        <Text style={styles.eyebrow}>{t('title')}</Text>
        <Text style={styles.name}>{user.displayName}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        <View style={styles.badgeRow}>
          <Badge variant="outline">{t('trip_count', { count: tripCount })}</Badge>
        </View>
      </View>
    </View>
  )
}
