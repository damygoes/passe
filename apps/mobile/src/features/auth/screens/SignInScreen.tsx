import { isClerkAPIResponseError } from '@clerk/expo'
import { useSignIn } from '@clerk/expo/legacy'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useTheme } from '@/hooks/useTheme'
import { AuthScreenLayout, OrDivider } from '@/features/auth/components/AuthScreenLayout'
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons'
import {
  OTPSchema,
  SignInSchema,
  type OTPFormValues,
  type SignInFormValues,
} from '@/features/auth/schemas/auth'

type Step = 'credentials' | 'verify'

export function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { colors, spacing, fontSizes, fonts } = useTheme()
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        errorBanner: {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: `${colors.destructive}33`,
          backgroundColor: `${colors.destructive}1A`,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
        },
        errorText: { fontSize: fontSizes.sm, color: colors.destructive },
        otpInput: {
          textAlign: 'center',
          letterSpacing: 8,
          fontFamily: fonts.mono,
        },
        footerText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        link: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '500' },
        smallLink: { fontSize: fontSizes.xs, color: colors.primary, fontWeight: '500' },
        resendRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
        footerRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
      }),
    [colors, spacing, fontSizes, fonts],
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: zodResolver(SignInSchema) })

  const otpForm = useForm<OTPFormValues>({ resolver: zodResolver(OTPSchema) })

  const onSubmit = async (data: SignInFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signIn.create({ identifier: data.email, password: data.password })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(app)/trips')
      } else if (
        (result.status as string) === 'needs_client_trust' ||
        result.status === 'needs_second_factor'
      ) {
        await signIn.prepareSecondFactor({ strategy: 'email_code' })
        setEmail(data.email)
        setStep('verify')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? 'Sign in failed')
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    }
  }

  const onOTPSubmit = async (data: OTPFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signIn.attemptSecondFactor({ strategy: 'email_code', code: data.code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(app)/trips')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? 'Verification failed',
        )
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    }
  }

  const resendCode = async () => {
    if (!isLoaded) return
    try {
      await signIn.prepareSecondFactor({ strategy: 'email_code' })
    } catch {
      // silent — user can try again
    }
  }

  if (step === 'verify') {
    return (
      <AuthScreenLayout heading="Check your email" subheading={`We sent a code to ${email}`}>
        {globalError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{globalError}</Text>
          </View>
        )}

        <Controller
          control={otpForm.control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Verification code"
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              inputStyle={styles.otpInput}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={otpForm.formState.errors.code?.message}
            />
          )}
        />

        <Button
          fullWidth
          size="lg"
          disabled={!isLoaded || otpForm.formState.isSubmitting}
          loading={otpForm.formState.isSubmitting}
          onPress={otpForm.handleSubmit(onOTPSubmit)}
        >
          {otpForm.formState.isSubmitting ? 'Verifying…' : 'Verify email'}
        </Button>

        <View style={styles.resendRow}>
          <Text style={styles.footerText}>Didn&apos;t receive it?</Text>
          <Text style={styles.smallLink} onPress={resendCode}>
            Resend code
          </Text>
        </View>
      </AuthScreenLayout>
    )
  }

  return (
    <AuthScreenLayout
      heading="Welcome back"
      subheading="Sign in to keep your travel memories"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/(auth)/sign-up" style={styles.link}>
            Sign up
          </Link>
        </View>
      }
    >
      {globalError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{globalError}</Text>
        </View>
      )}

      <SocialAuthButtons />
      <OrDivider label="or continue with email" />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            iconPosition="start"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Password"
            labelRight={
              <Link href="/(auth)/forgot-password" style={styles.smallLink}>
                Forgot password?
              </Link>
            }
            placeholder="••••••••"
            autoComplete="current-password"
            secureTextEntry={!showPassword}
            icon={showPassword ? 'eye-off' : 'eye'}
            iconPosition="end"
            onIconPress={() => setShowPassword((v) => !v)}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      <Button
        fullWidth
        size="lg"
        disabled={!isLoaded || isSubmitting}
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </AuthScreenLayout>
  )
}
