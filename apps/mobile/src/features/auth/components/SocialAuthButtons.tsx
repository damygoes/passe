import { isClerkAPIResponseError, useSSO } from '@clerk/expo'
import { logger } from '@passe/logger'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { createButtonRecipe } from '@/recipes/button'
import { AppleIcon, GoogleIcon } from './SocialIcons'

type Provider = 'google' | 'apple'

function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS === 'android') void WebBrowser.warmUpAsync()
    return () => {
      if (Platform.OS === 'android') void WebBrowser.coolDownAsync()
    }
  }, [])
}

export function SocialAuthButtons() {
  useWarmUpBrowser()
  const theme = useTheme()
  const { colors, spacing } = theme
  const buttonRecipe = createButtonRecipe(theme)
  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const t = useTranslations('auth.social')
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[3] },
        content: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
      }),
    [spacing],
  )

  const handleOAuth = useCallback(
    async (provider: Provider) => {
      setLoadingProvider(provider)
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy: provider === 'google' ? 'oauth_google' : 'oauth_apple',
          redirectUrl: AuthSession.makeRedirectUri({ scheme: 'passemobile' }),
        })

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId })
          router.replace('/(app)/trips')
        }
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          logger.warn('OAuth error', { error: err.errors[0]?.message })
        }
      } finally {
        setLoadingProvider(null)
      }
    },
    [startSSOFlow, router],
  )

  const labelStyle = [buttonRecipe.variants.secondary.label, buttonRecipe.sizes.md.label]

  return (
    <View style={styles.wrapper}>
      <Button
        variant="secondary"
        fullWidth
        loading={loadingProvider === 'google'}
        disabled={loadingProvider !== null}
        onPress={() => handleOAuth('google')}
      >
        <View style={styles.content}>
          {loadingProvider !== 'google' && <GoogleIcon />}
          <Text style={labelStyle}>{t('google')}</Text>
        </View>
      </Button>
      <Button
        variant="secondary"
        fullWidth
        loading={loadingProvider === 'apple'}
        disabled={loadingProvider !== null}
        onPress={() => handleOAuth('apple')}
      >
        <View style={styles.content}>
          {loadingProvider !== 'apple' && <AppleIcon color={colors.foreground} />}
          <Text style={labelStyle}>{t('apple')}</Text>
        </View>
      </Button>
    </View>
  )
}
