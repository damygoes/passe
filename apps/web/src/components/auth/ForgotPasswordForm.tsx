'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { ForgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/schemas/auth'

export function ForgotPasswordForm() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)

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
      router.push('/reset-password')
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? 'Request failed')
      } else {
        setGlobalError('Something went wrong. Please try again.')
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
          Email address
        </label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
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
        {isSubmitting ? 'Sending…' : 'Send reset code'}
      </Button>
    </form>
  )
}
