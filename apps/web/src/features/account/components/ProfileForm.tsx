'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useUpdateUser } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { Input } from '@passe/ui/input'
import { Textarea } from '@passe/ui/textarea'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UpdateUserSchema, type ProfileFormValues } from '../schemas/account'

interface ProfileFormProps {
  displayName: string
  username: string
  bio: string | null
  email: string
}

export function ProfileForm({ displayName, username, bio, email }: ProfileFormProps) {
  const t = useTranslations('account.profile')
  const tErrors = useTranslations('account.errors')
  const { mutateAsync, isPending } = useUpdateUser()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { displayName, username, bio: bio ?? '' },
  })

  useEffect(() => {
    if (!success) return
    const id = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(id)
  }, [success])

  const onSubmit = async (data: ProfileFormValues) => {
    setGlobalError(null)
    setSuccess(false)

    try {
      await mutateAsync(data)
      setSuccess(true)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('update_failed'))
      } else {
        setGlobalError(tErrors('update_failed'))
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

        {/* Read-only email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            value={email}
            disabled
            icon="mail"
            iconPosition="start"
            className="opacity-60 cursor-not-allowed"
            readOnly
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="displayName" className="text-sm font-medium text-foreground">
            {t('display_name_label')}
          </label>
          <Input
            id="displayName"
            type="text"
            autoComplete="name"
            icon="user"
            iconPosition="start"
            aria-invalid={!!errors.displayName}
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="text-xs text-destructive">{errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            {t('username_label')}
          </label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            icon="at"
            iconPosition="start"
            aria-invalid={!!errors.username}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-foreground">
            {t('bio_label')}
          </label>
          <Textarea
            id="bio"
            rows={3}
            placeholder={t('bio_placeholder')}
            aria-invalid={!!errors.bio}
            {...register('bio')}
          />
          {errors.bio && (
            <p className="text-xs text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={isPending} isLoading={isPending}>
            {isPending ? t('saving') : t('save')}
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
