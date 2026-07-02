import { isClerkAPIResponseError } from '@clerk/expo'
import { useSignUp } from '@clerk/expo/legacy'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useTheme } from '@/hooks/useTheme'
import { AuthScreenLayout, OrDivider } from '@/features/auth/components/AuthScreenLayout'
import { PasswordMatchIndicator } from '@/features/auth/components/PasswordMatchIndicator'
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter'
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons'
import {
  OTPSchema,
  SignUpSchema,
  type OTPFormValues,
  type SignUpFormValues,
} from '@/features/auth/schemas/auth'

type Step = 'details' | 'verify'

export function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const { colors, spacing, fontSizes, fonts } = useTheme()
  const [step, setStep] = useState<Step>('details')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
        otpInput: { textAlign: 'center', letterSpacing: 8, fontFamily: fonts.mono },
        footerText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        link: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '500' },
        smallLink: { fontSize: fontSizes.xs, color: colors.primary, fontWeight: '500' },
        resendRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
        footerRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
      }),
    [colors, spacing, fontSizes, fonts],
  )

  const detailsForm = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = detailsForm

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  const otpForm = useForm<OTPFormValues>({ resolver: zodResolver(OTPSchema) })

  useEffect(() => {
    if (step === 'verify') {
      otpForm.setValue('code', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const onDetailsSubmit = async (data: SignUpFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.displayName,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('verify')
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? 'Sign up failed')
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    }
  }

  const onOTPSubmit = async (data: OTPFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: data.code })
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
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    } catch {
      // silent — user can try again
    }
  }

  if (step === 'verify') {
    return (
      <AuthScreenLayout
        heading="Check your email"
        subheading={`We sent a code to ${detailsForm.getValues('email')}`}
      >
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
      heading="Create your account"
      subheading="Start keeping your travel memories"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            Sign in
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
        name="displayName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Display name"
            placeholder="Your name"
            autoComplete="name"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.displayName?.message}
          />
        )}
      />

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

      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Password"
              placeholder="••••••••"
              autoComplete="new-password"
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
        <PasswordStrengthMeter password={password} />
      </View>

      <View>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Confirm password"
              placeholder="••••••••"
              autoComplete="new-password"
              secureTextEntry={!showConfirmPassword}
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              iconPosition="end"
              onIconPress={() => setShowConfirmPassword((v) => !v)}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />
      </View>

      <Button
        fullWidth
        size="lg"
        disabled={!isLoaded || isSubmitting}
        loading={isSubmitting}
        onPress={handleSubmit(onDetailsSubmit)}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </AuthScreenLayout>
  )
}
