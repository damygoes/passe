import { useUser } from '@clerk/expo'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { useTheme } from '@/hooks/useTheme'

export function AccountScreen() {
  const { colors, spacing, fontSizes, fontWeights } = useTheme()
  const { user } = useUser()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          padding: spacing[4],
          gap: spacing[4],
        },
        text: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.foreground },
        email: { fontSize: fontSizes.sm, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account</Text>
      {user?.primaryEmailAddress && (
        <Text style={styles.email}>{user.primaryEmailAddress.emailAddress}</Text>
      )}
      <LogoutButton />
    </View>
  )
}
