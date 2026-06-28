'use client'

import { SignInSchema, type SignInFormValues } from '@/lib/schemas/auth'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const t = useTranslations('auth.form')
  const tErrors = useTranslations('auth.errors')
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
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
        router.push('/dashboard')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('sign_in_failed'))
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
            href="/forgot-password"
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
