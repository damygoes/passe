'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/auth'

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const t = useTranslations('auth.form')
  const tErrors = useTranslations('auth.errors')
  const tValidation = useTranslations('auth.validation')
  const [resetEmail, setResetEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  useEffect(() => {
    setResetEmail(sessionStorage.getItem('reset-email'))
  }, [])

  const ResetPasswordSchema = useMemo(() => createResetPasswordSchema(tValidation), [tValidation])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      })

      if (result.status === 'complete') {
        sessionStorage.removeItem('reset-email')
        await setActive({ session: result.createdSessionId })
        router.push(routes.dashboard)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('reset_failed'))
      } else {
        setGlobalError(tErrors('generic'))
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {resetEmail && (
        <p className="text-center text-xs text-muted-foreground">
          {t('code_sent_to', { email: resetEmail })}
        </p>
      )}

      {globalError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {globalError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="reset-code" className="text-sm font-medium text-foreground">
          {t('reset_code_label')}
        </label>
        <Input
          id="reset-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder={t('verification_code_placeholder')}
          aria-invalid={!!errors.code}
          className="text-center tracking-[0.5em] font-mono"
          {...register('code')}
        />
        {errors.code && (
          <p className="text-xs text-destructive">{errors.code.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="reset-password" className="text-sm font-medium text-foreground">
          {t('new_password_label')}
        </label>
        <Input
          id="reset-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('password_placeholder')}
          icon={showPassword ? 'eye-off' : 'eye'}
          iconPosition="end"
          onIconClick={() => setShowPassword((v) => !v)}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isLoaded || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? t('resetting') : t('reset_password')}
      </Button>
    </form>
  )
}
