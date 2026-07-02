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
import { useTranslations } from '@/i18n/useTranslations'
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout'
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/auth'

type Step = 'request' | 'reset'

export function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { colors, spacing, fontSizes, fonts } = useTheme()
  const t = useTranslations('auth.form')
  const tForgotPassword = useTranslations('auth.forgot_password')
  const tResetPassword = useTranslations('auth.reset_password')
  const tErrors = useTranslations('auth.errors')
  const tValidation = useTranslations('auth.validation')
  const [step, setStep] = useState<Step>('request')
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
        otpInput: { textAlign: 'center', letterSpacing: 8, fontFamily: fonts.mono },
        footerText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        link: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '500' },
        footerRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
        codeSentText: {
          textAlign: 'center',
          fontSize: fontSizes.xs,
          color: colors.mutedForeground,
        },
      }),
    [colors, spacing, fontSizes, fonts],
  )

  const ForgotPasswordSchema = useMemo(() => createForgotPasswordSchema(tValidation), [tValidation])
  const ResetPasswordSchema = useMemo(() => createResetPasswordSchema(tValidation), [tValidation])

  const requestForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const onRequestSubmit = async (data: ForgotPasswordFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: data.email })
      setEmail(data.email)
      setStep('reset')
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('request_failed'),
        )
      } else {
        setGlobalError(tErrors('generic'))
      }
    }
  }

  const onResetSubmit = async (data: ResetPasswordFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(app)/trips')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('reset_failed'),
        )
      } else {
        setGlobalError(tErrors('generic'))
      }
    }
  }

  if (step === 'reset') {
    return (
      <AuthScreenLayout heading={tResetPassword('heading')} subheading={tResetPassword('subheading')}>
        <Text style={styles.codeSentText}>{t('code_sent_to', { email })}</Text>

        {globalError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{globalError}</Text>
          </View>
        )}

        <Controller
          control={resetForm.control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={t('reset_code_label')}
              placeholder={t('verification_code_placeholder')}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              inputStyle={styles.otpInput}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={resetForm.formState.errors.code?.message}
            />
          )}
        />

        <Controller
          control={resetForm.control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={t('new_password_label')}
              placeholder={t('password_placeholder')}
              autoComplete="new-password"
              secureTextEntry={!showPassword}
              icon={showPassword ? 'eye-off' : 'eye'}
              iconPosition="end"
              onIconPress={() => setShowPassword((v) => !v)}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={resetForm.formState.errors.password?.message}
            />
          )}
        />

        <Button
          fullWidth
          size="lg"
          disabled={!isLoaded || resetForm.formState.isSubmitting}
          loading={resetForm.formState.isSubmitting}
          onPress={resetForm.handleSubmit(onResetSubmit)}
        >
          {resetForm.formState.isSubmitting ? t('resetting') : t('reset_password')}
        </Button>
      </AuthScreenLayout>
    )
  }

  return (
    <AuthScreenLayout
      heading={tForgotPassword('heading')}
      subheading={tForgotPassword('subheading')}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{tForgotPassword('remembered')}</Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            {tForgotPassword('back_to_sign_in')}
          </Link>
        </View>
      }
    >
      {globalError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{globalError}</Text>
        </View>
      )}

      <Controller
        control={requestForm.control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label={t('email_label')}
            placeholder={t('email_placeholder')}
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
            iconPosition="start"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={requestForm.formState.errors.email?.message}
          />
        )}
      />

      <Button
        fullWidth
        size="lg"
        disabled={!isLoaded || requestForm.formState.isSubmitting}
        loading={requestForm.formState.isSubmitting}
        onPress={requestForm.handleSubmit(onRequestSubmit)}
      >
        {requestForm.formState.isSubmitting ? t('sending') : t('send_reset_code')}
      </Button>
    </AuthScreenLayout>
  )
}
