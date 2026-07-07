'use client'

import {
  createOTPSchema,
  createSignUpSchema,
  type OTPFormValues,
  type SignUpFormValues,
} from '@/features/auth/schemas/auth'
import { useSignUp } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordMatchIndicator } from './PasswordMatchIndicator'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

type Step = 'details' | 'verify'

export function SignUpForm() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const t = useTranslations('auth.form')
  const tSignUp = useTranslations('auth.sign_up')
  const tErrors = useTranslations('auth.errors')
  const tValidation = useTranslations('auth.validation')
  const [step, setStep] = useState<Step>('details')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const SignUpSchema = useMemo(() => createSignUpSchema(tValidation), [tValidation])
  const OTPSchema = useMemo(() => createOTPSchema(tValidation), [tValidation])

  const detailsForm = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = detailsForm

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(OTPSchema),
  })

  // Chrome autofills the OTP input with the email from the previous step.
  // Clear the field once the verify step mounts so the user starts with a blank input.
  useEffect(() => {
    if (step === 'verify') {
      otpForm.setValue('code', '')
    }
  }, [step, otpForm])

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
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('sign_up_failed'),
        )
      } else {
        setGlobalError(tErrors('generic'))
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
        router.push(routes.dashboard)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('verification_failed'),
        )
      } else {
        setGlobalError(tErrors('generic'))
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
      <form
        onSubmit={otpForm.handleSubmit(onOTPSubmit)}
        className="space-y-4"
        noValidate
        autoComplete="off"
      >
        <div className="space-y-1 text-center">
          <p className="text-sm text-foreground font-medium">{t('check_email_heading')}</p>
          <p className="text-xs text-muted-foreground">
            {t('check_email_body', { email: detailsForm.getValues('email') })}
          </p>
        </div>

        {globalError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {globalError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="otp-code" className="text-sm font-medium text-foreground">
            {t('verification_code_label')}
          </label>
          <Input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder={t('verification_code_placeholder')}
            aria-invalid={!!otpForm.formState.errors.code}
            className="text-center tracking-[0.5em] font-mono"
            {...otpForm.register('code')}
          />
          {otpForm.formState.errors.code && (
            <p className="text-xs text-destructive">{otpForm.formState.errors.code.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isLoaded || otpForm.formState.isSubmitting}
          isLoading={otpForm.formState.isSubmitting}
        >
          {otpForm.formState.isSubmitting ? t('verifying') : t('verify_email')}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {t('didnt_receive')}{' '}
          <button
            type="button"
            onClick={resendCode}
            className="text-primary transition-opacity hover:opacity-70"
          >
            {t('resend_code')}
          </button>
        </p>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-4" noValidate>
      {globalError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {globalError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
          {t('display_name_label')}
        </label>
        <Input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder={t('display_name_placeholder')}
          aria-invalid={!!errors.displayName}
          {...register('displayName')}
        />
        {errors.displayName && (
          <p className="text-xs text-destructive">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          {t('email_label')}
        </label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder={t('email_placeholder')}
          icon="mail"
          iconPosition="start"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          {t('password_label')}
        </label>
        <Input
          id="signup-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('password_placeholder')}
          icon={showPassword ? 'eye-off' : 'eye'}
          iconPosition="end"
          onIconClick={() => setShowPassword((v) => !v)}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <PasswordStrengthMeter password={password} />
        {isSubmitted && errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-confirm-password" className="text-sm font-medium text-foreground">
          {t('confirm_password_label')}
        </label>
        <Input
          id="signup-confirm-password"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('password_placeholder')}
          icon={showConfirmPassword ? 'eye-off' : 'eye'}
          iconPosition="end"
          onIconClick={() => setShowConfirmPassword((v) => !v)}
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />
        {isSubmitted && errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!isLoaded || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? t('creating_account') : t('create_account')}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {tSignUp.rich('consent', {
          terms: (chunks) => (
            <Link
              href={routes.termsOfService}
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href={routes.privacyPolicy}
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
      <div id="clerk-captcha" />
    </form>
  )
}
