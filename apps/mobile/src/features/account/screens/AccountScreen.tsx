import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useMemo } from 'react'
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { AccountMenuRow } from '@/features/account/components/AccountMenuRow'
import { LegalSection } from '@/features/account/components/LegalSection'
import { PlanSection } from '@/features/account/components/PlanSection'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

export function AccountScreen() {
  const { colors, spacing, fontSizes, fontWeights } = useTheme()
  const { user } = useUser()
  const router = useRouter()
  const t = useTranslations('account.tabs')
  const headerHeight = useHeaderHeight()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          flexGrow: 1,
          padding: spacing[6],
          // iOS gets the header inset from `contentInsetAdjustmentBehavior` below —
          // adding headerHeight here too would double up the top space.
          paddingTop: Platform.OS === 'android' ? headerHeight + spacing[6] : spacing[6],
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
    [colors, spacing, fontSizes, fontWeights, headerHeight],
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
      >
        <Animated.View entering={enterUp(0)} style={styles.userHeader}>
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
            {user?.imageUrl && <AvatarImage source={{ uri: user.imageUrl }} />}
          </Avatar>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            {email && <Text style={styles.userEmail}>{email}</Text>}
          </View>
        </Animated.View>

        <Separator />

        <Animated.View entering={enterUp(80)}>
          <PlanSection />
        </Animated.View>

        <Animated.View entering={enterUp(160)} style={styles.menu}>
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
        </Animated.View>

        <Separator />

        <Animated.View entering={enterUp(240)}>
          <LegalSection />
        </Animated.View>

        <View style={styles.footer}>
          <LogoutButton fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
