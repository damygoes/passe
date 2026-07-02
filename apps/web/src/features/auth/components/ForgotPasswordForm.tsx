'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth'

export function ForgotPasswordForm() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const t = useTranslations('auth.form')
  const tErrors = useTranslations('auth.errors')
  const tValidation = useTranslations('auth.validation')
  const [globalError, setGlobalError] = useState<string | null>(null)

  const ForgotPasswordSchema = useMemo(
    () => createForgotPasswordSchema(tValidation),
    [tValidation],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (!isLoaded) return
    setGlobalError(null)

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      })
      // Carry the email to the reset page so we can show it there
      sessionStorage.setItem('reset-email', data.email)
      router.push(routes.resetPassword)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('request_failed'))
      } else {
        setGlobalError(tErrors('generic'))
      }
    }
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
        <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
          {t('email_address_label')}
        </label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder={t('email_placeholder')}
          icon="mail"
          iconPosition="start"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isLoaded || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? t('sending') : t('send_reset_code')}
      </Button>
    </form>
  )
}
