'use client'

import { PasswordMatchIndicator } from '@/features/auth/components/PasswordMatchIndicator'
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter'
import { useUser } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { Input } from '@passe/ui/input'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordSchema, type PasswordFormValues } from '../schemas/account'

export function PasswordForm() {
  const { user, isLoaded } = useUser()
  const t = useTranslations('account.security')
  const tErrors = useTranslations('account.errors')
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
  })

  const newPassword = watch('newPassword', '')
  const confirmPassword = watch('confirmPassword', '')

  useEffect(() => {
    if (!success) return
    const id = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(id)
  }, [success])

  const onSubmit = async (data: PasswordFormValues) => {
    if (!isLoaded || !user) return
    setGlobalError(null)
    setSuccess(false)

    try {
      await user.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        signOutOfOtherSessions: false,
      })
      setSuccess(true)
      reset()
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('password_failed'),
        )
      } else {
        setGlobalError(tErrors('password_failed'))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('description')}</p>
      </div>

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
          <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
            {t('current_password_label')}
          </label>
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            icon={showCurrentPassword ? 'eye-off' : 'eye'}
            iconPosition="end"
            onIconClick={() => setShowCurrentPassword((v) => !v)}
            aria-invalid={!!errors.currentPassword}
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            {t('new_password_label')}
          </label>
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            icon={showNewPassword ? 'eye-off' : 'eye'}
            iconPosition="end"
            onIconClick={() => setShowNewPassword((v) => !v)}
            aria-invalid={!!errors.newPassword}
            {...register('newPassword')}
          />
          <PasswordStrengthMeter password={newPassword} />
          {errors.newPassword && (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            {t('confirm_password_label')}
          </label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            iconPosition="end"
            onIconClick={() => setShowConfirmPassword((v) => !v)}
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <PasswordMatchIndicator password={newPassword} confirmPassword={confirmPassword} />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={!isLoaded || isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? t('updating') : t('update')}
          </Button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 animate-in fade-in duration-300">
              <Icon name="check" size="sm" />
              {t('success')}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
