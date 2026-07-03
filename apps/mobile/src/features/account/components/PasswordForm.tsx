import { isClerkAPIResponseError, useSession, useUser } from '@clerk/expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { createPasswordSchema, type PasswordFormValues } from '@/features/account/schemas/account'
import { PasswordMatchIndicator } from '@/features/auth/components/PasswordMatchIndicator'
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter'
import { createOTPSchema, type OTPFormValues } from '@/features/auth/schemas/auth'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

type Step = 'form' | 'verify'

export function PasswordForm() {
  const { user, isLoaded } = useUser()
  const { session } = useSession()
  const { colors, palette, spacing, fonts, fontSizes, fontWeights } = useTheme()
  const t = useTranslations('account.security')
  const tAuth = useTranslations('auth.form')
  const tErrors = useTranslations('account.errors')
  const tValidation = useTranslations('auth.validation')

  const [step, setStep] = useState<Step>('form')
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const pendingData = useRef<PasswordFormValues | null>(null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: spacing[6] },
        otpInput: { textAlign: 'center', letterSpacing: 8, fontFamily: fonts.mono },
        footerRow: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[3],
        },
        successRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        successText: { fontSize: fontSizes.sm, color: palette.deepOlive.DEFAULT },
        resendRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing[1] },
        footerText: { fontSize: fontSizes.xs, color: colors.mutedForeground },
        smallLink: { fontSize: fontSizes.xs, color: colors.primary, fontWeight: '500' },
        headingGroup: { gap: spacing[1] },
        verifyTitle: {
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        description: {
          fontSize: fontSizes.sm,
          color: colors.mutedForeground,
          marginTop: -spacing[4],
        },
      }),
    [colors, palette, spacing, fonts, fontSizes, fontWeights],
  )

  const PasswordSchema = useMemo(() => createPasswordSchema(tValidation), [tValidation])
  const OTPSchema = useMemo(() => createOTPSchema(tValidation), [tValidation])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(PasswordSchema) })

  const otpForm = useForm<OTPFormValues>({ resolver: zodResolver(OTPSchema) })

  const newPassword = watch('newPassword', '')
  const confirmPassword = watch('confirmPassword', '')

  useEffect(() => {
    if (!success) return
    const id = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(id)
  }, [success])

  const doUpdatePassword = async (data: PasswordFormValues) => {
    await user!.updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      signOutOfOtherSessions: false,
    })
    setSuccess(true)
    reset()
    pendingData.current = null
  }

  const prepareEmailVerification = async () => {
    const verification = await session?.startVerification({ level: 'first_factor' })
    const emailFactor = verification?.supportedFirstFactors?.find(
      (factor): factor is Extract<typeof factor, { strategy: 'email_code' }> =>
        factor.strategy === 'email_code',
    )
    if (emailFactor) {
      await session?.prepareFirstFactorVerification({
        strategy: 'email_code',
        emailAddressId: emailFactor.emailAddressId,
      })
    }
  }

  const onSubmit = async (data: PasswordFormValues) => {
    if (!isLoaded || !user) return
    setGlobalError(null)
    setSuccess(false)

    try {
      await doUpdatePassword(data)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        if (err.errors[0]?.code === 'session_reverification_required') {
          pendingData.current = data
          try {
            await prepareEmailVerification()
            setStep('verify')
          } catch {
            setGlobalError(tErrors('reverification_failed'))
          }
        } else {
          setGlobalError(
            err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('password_failed'),
          )
        }
      } else {
        setGlobalError(tErrors('password_failed'))
      }
    }
  }

  const onOTPSubmit = async (data: OTPFormValues) => {
    if (!session || !pendingData.current) return
    setGlobalError(null)

    try {
      const result = await session.attemptFirstFactorVerification({
        strategy: 'email_code',
        code: data.code,
      })
      if (result.status === 'complete') {
        await doUpdatePassword(pendingData.current)
        otpForm.reset()
        setStep('form')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('reverification_failed'),
        )
      } else {
        setGlobalError(tErrors('reverification_failed'))
      }
    }
  }

  const resendCode = async () => {
    if (!session) return
    try {
      await prepareEmailVerification()
    } catch {
      // silent — user can try again
    }
  }

  if (step === 'verify') {
    return (
      <View style={styles.form}>
        <View style={styles.headingGroup}>
          <Text style={styles.verifyTitle}>{t('verify_title')}</Text>
          <Text style={styles.description}>
            {t('verify_description', { email: user?.primaryEmailAddress?.emailAddress ?? '' })}
          </Text>
        </View>

        {globalError && <ErrorBanner message={globalError} />}

        <Controller
          control={otpForm.control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={tAuth('verification_code_label')}
              placeholder={tAuth('verification_code_placeholder')}
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
          disabled={!isLoaded || otpForm.formState.isSubmitting}
          loading={otpForm.formState.isSubmitting}
          onPress={otpForm.handleSubmit(onOTPSubmit)}
        >
          {otpForm.formState.isSubmitting ? tAuth('verifying') : tAuth('verify_email')}
        </Button>

        <View style={styles.resendRow}>
          <Text style={styles.footerText}>{tAuth('didnt_receive')}</Text>
          <Text style={styles.smallLink} onPress={resendCode}>
            {tAuth('resend_code')}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.form}>
      <Text style={styles.description}>{t('description')}</Text>

      {globalError && <ErrorBanner message={globalError} />}

      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label={t('current_password_label')}
            autoComplete="current-password"
            secureTextEntry={!showCurrentPassword}
            icon={showCurrentPassword ? 'eye-off' : 'eye'}
            iconPosition="end"
            onIconPress={() => setShowCurrentPassword((visible) => !visible)}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.currentPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.form}>
            <FormField
              label={t('new_password_label')}
              autoComplete="new-password"
              secureTextEntry={!showNewPassword}
              icon={showNewPassword ? 'eye-off' : 'eye'}
              iconPosition="end"
              onIconPress={() => setShowNewPassword((visible) => !visible)}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.newPassword?.message}
            />
            <PasswordStrengthMeter password={newPassword} />
          </View>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.form}>
            <FormField
              label={t('confirm_password_label')}
              autoComplete="new-password"
              secureTextEntry={!showConfirmPassword}
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              iconPosition="end"
              onIconPress={() => setShowConfirmPassword((visible) => !visible)}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.confirmPassword?.message}
            />
            <PasswordMatchIndicator password={newPassword} confirmPassword={confirmPassword} />
          </View>
        )}
      />

      <View style={styles.footerRow}>
        <Button
          fullWidth
          disabled={!isLoaded || isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? t('updating') : t('update')}
        </Button>
        {success && (
          <View style={styles.successRow}>
            <Icon name="check" size="sm" color={palette.deepOlive.DEFAULT} />
            <Text style={styles.successText}>{t('success')}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
