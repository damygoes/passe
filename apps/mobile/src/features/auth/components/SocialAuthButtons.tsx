import { isClerkAPIResponseError, useSSO } from '@clerk/expo'
import { useSignIn, useSignUp } from '@clerk/expo/legacy'
import { logger } from '@passe/logger'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppState, Linking, Platform, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { createButtonRecipe } from '@/recipes/button'
import { AppleIcon, GoogleIcon } from './SocialIcons'

type Provider = 'google' | 'apple'

/**
 * expo-web-browser's Android `openAuthSessionAsync` polyfill races `AppState`
 * turning 'active' against the `Linking` redirect event, and `AppState` often
 * wins even when the redirect already landed — resolving 'dismiss' on a
 * successful sign-in (https://github.com/expo/expo/issues/6289). Waiting a
 * beat after 'active' gives the redirect event a chance to arrive first.
 */
function waitForOAuthRedirect(redirectUrl: string): Promise<string | null> {
  // Clerk's OAuth callback redirects to "<scheme>:?..." (no "//"), while
  // AuthSession.makeRedirectUri({ scheme }) produces "<scheme>://" — compare
  // by scheme prefix rather than the full redirectUrl string.
  const schemePrefix = `${redirectUrl.split('://')[0]}:`

  return new Promise((resolve) => {
    let settled = false
    const finish = (url: string | null) => {
      if (settled) return
      settled = true
      linkingSubscription.remove()
      appStateSubscription.remove()
      resolve(url)
    }

    const linkingSubscription = Linking.addEventListener('url', (event) => {
      if (event.url.startsWith(schemePrefix)) finish(event.url)
    })

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setTimeout(async () => {
          const initialUrl = await Linking.getInitialURL()
          finish(initialUrl?.startsWith(schemePrefix) ? initialUrl : null)
        }, 700)
      }
    })
  })
}

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
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
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

  // Android bypasses useSSO()'s startSSOFlow, which relies on expo-web-browser's
  // openAuthSessionAsync polyfill on that platform — see waitForOAuthRedirect.
  const handleAndroidOAuth = useCallback(
    async (strategy: 'oauth_google' | 'oauth_apple', redirectUrl: string) => {
      if (!isSignInLoaded || !isSignUpLoaded) return

      await signIn.create({ strategy, redirectUrl })
      const { externalVerificationRedirectURL } = signIn.firstFactorVerification
      if (!externalVerificationRedirectURL) {
        throw new Error('Missing external verification redirect URL for SSO flow')
      }

      const browserResult = await WebBrowser.openBrowserAsync(
        externalVerificationRedirectURL.toString(),
      )
      const redirectedUrl =
        browserResult.type === 'opened' ? await waitForOAuthRedirect(redirectUrl) : null
      if (!redirectedUrl) return

      const rotatingTokenNonce = new URL(redirectedUrl).searchParams.get('rotating_token_nonce') ?? ''
      await signIn.reload({ rotatingTokenNonce })

      let createdSessionId = signIn.createdSessionId
      if (signIn.firstFactorVerification.status === 'transferable') {
        await signUp.create({ transfer: true })
        createdSessionId = signUp.createdSessionId
      }

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        router.replace('/(app)/trips')
      } else {
        logger.warn('OAuth flow did not return a session', {
          signInStatus: signIn.status,
          signUpStatus: signUp.status,
          signUpMissingFields: signUp.missingFields,
          signUpUnverifiedFields: signUp.unverifiedFields,
        })
      }
    },
    [isSignInLoaded, isSignUpLoaded, signIn, signUp, setActive, router],
  )

  const handleOAuth = useCallback(
    async (provider: Provider) => {
      setLoadingProvider(provider)
      try {
        const strategy = provider === 'google' ? 'oauth_google' : 'oauth_apple'
        const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'passemobile' })

        if (Platform.OS === 'android') {
          await handleAndroidOAuth(strategy, redirectUrl)
          return
        }

        const { createdSessionId, setActive: setActiveSSO } = await startSSOFlow({
          strategy,
          redirectUrl,
        })

        if (createdSessionId && setActiveSSO) {
          await setActiveSSO({ session: createdSessionId })
          router.replace('/(app)/trips')
        }
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          logger.warn('OAuth error', { error: err.errors[0]?.message })
        } else {
          logger.warn('OAuth unexpected error', {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          })
        }
      } finally {
        setLoadingProvider(null)
      }
    },
    [startSSOFlow, handleAndroidOAuth, router],
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
