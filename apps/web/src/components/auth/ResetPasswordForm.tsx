'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { ResetPasswordSchema, type ResetPasswordFormValues } from '@/lib/schemas/auth'

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [resetEmail, setResetEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  useEffect(() => {
    setResetEmail(sessionStorage.getItem('reset-email'))
  }, [])

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
        router.push('/dashboard')
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? 'Reset failed')
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {resetEmail && (
        <p className="text-center text-xs text-muted-foreground">
          Code sent to <span className="font-medium text-foreground">{resetEmail}</span>
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
          Reset code
        </label>
        <Input
          id="reset-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
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
          New password
        </label>
        <Input
          id="reset-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
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
        {isSubmitting ? 'Resetting…' : 'Reset password'}
      </Button>
    </form>
  )
}
