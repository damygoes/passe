'use client'

import { SignInSchema, OTPSchema, type SignInFormValues, type OTPFormValues } from '@/features/auth/schemas/auth'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Step = 'credentials' | 'verify'

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const t = useTranslations('auth.form')
  const tErrors = useTranslations('auth.errors')
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
  })

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(OTPSchema),
  })

  const onSubmit = async (data: SignInFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push(routes.dashboard)
      } else if (
        // needs_client_trust = Clerk's device trust flow (new device verification)
        (result.status as string) === 'needs_client_trust' ||
        result.status === 'needs_second_factor'
      ) {
        await signIn.prepareSecondFactor({ strategy: 'email_code' })
        setEmail(data.email)
        setStep('verify')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('sign_in_failed'))
      } else {
        setGlobalError(tErrors('generic'))
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
      await signIn.prepareSecondFactor({ strategy: 'email_code' })
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
          <p className="text-xs text-muted-foreground">{t('check_email_body', { email })}</p>
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
          <label htmlFor="signin-otp-code" className="text-sm font-medium text-foreground">
            {t('verification_code_label')}
          </label>
          <Input
            id="signin-otp-code"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {globalError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {globalError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
          {t('email_label')}
        </label>
        <Input
          id="signin-email"
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
        <div className="flex items-center justify-between">
          <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
            {t('password_label')}
          </label>
          <Link
            href={routes.forgotPassword}
            className="text-xs text-primary transition-opacity hover:opacity-70"
          >
            {t('forgot_password_link')}
          </Link>
        </div>
        <Input
          id="signin-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder={t('password_placeholder')}
          icon={showPassword ? 'eye-off' : 'eye'}
          iconPosition="end"
          onIconClick={() => setShowPassword((v) => !v)}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!isLoaded || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? t('signing_in') : t('sign_in')}
      </Button>
    </form>
  )
}
