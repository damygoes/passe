import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { AccountMenuRow } from '@/features/account/components/AccountMenuRow'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function AccountScreen() {
  const { colors, spacing, fontSizes, fontWeights } = useTheme()
  const { user } = useUser()
  const router = useRouter()
  const t = useTranslations('account.tabs')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          flexGrow: 1,
          padding: spacing[6],
          gap: spacing[6],
        },
        userHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
        userInfo: { flex: 1, gap: spacing[1] },
        userName: {
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        userEmail: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        menu: { gap: spacing[1] },
        footer: { marginTop: 'auto' },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  const email = user?.primaryEmailAddress?.emailAddress ?? ''
  const displayName = user?.fullName ?? email
  const initials = (user?.fullName ?? email)
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userHeader}>
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
            {user?.imageUrl && <AvatarImage source={{ uri: user.imageUrl }} />}
          </Avatar>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            {email && <Text style={styles.userEmail}>{email}</Text>}
          </View>
        </View>

        <Separator />

        <View style={styles.menu}>
          <AccountMenuRow
            icon="globe"
            label={t('portfolio')}
            onPress={() => router.push('/(app)/account/portfolio')}
          />
          <AccountMenuRow
            icon="user"
            label={t('profile')}
            onPress={() => router.push('/(app)/account/profile')}
          />
          <AccountMenuRow
            icon="lock"
            label={t('security')}
            onPress={() => router.push('/(app)/account/security')}
          />
          <AccountMenuRow
            icon="alert"
            label={t('danger')}
            destructive
            onPress={() => router.push('/(app)/account/danger')}
          />
        </View>

        <View style={styles.footer}>
          <LogoutButton fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
