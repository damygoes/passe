import { isClerkAPIResponseError } from '@clerk/expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateUser } from '@passe/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { Textarea } from '@/components/ui/textarea'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { createProfileSchema, type ProfileFormValues } from '@/features/account/schemas/account'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { createFormFieldRecipe } from '@/recipes/form-field'

interface ProfileFormProps {
  displayName: string
  username: string
  bio: string | null
  email: string
}

export function ProfileForm({ displayName, username, bio, email }: ProfileFormProps) {
  const theme = useTheme()
  const { palette, spacing, fontSizes } = theme
  const fieldRecipe = createFormFieldRecipe(theme)
  const t = useTranslations('account.profile')
  const tForm = useTranslations('auth.form')
  const tErrors = useTranslations('account.errors')
  const tValidation = useTranslations('auth.validation')
  const { mutateAsync, isPending } = useUpdateUser()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: spacing[6] },
        footerRow: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[3],
        },
        successRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        successText: { fontSize: fontSizes.sm, color: palette.deepOlive.DEFAULT },
        readOnlyInput: { opacity: 0.6 },
      }),
    [palette, spacing, fontSizes],
  )

  const ProfileSchema = useMemo(() => createProfileSchema(tValidation), [tValidation])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
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
        setGlobalError(
          err.errors[0]?.longMessage ?? err.errors[0]?.message ?? tErrors('update_failed'),
        )
      } else {
        setGlobalError(tErrors('update_failed'))
      }
    }
  }

  return (
    <View style={styles.form}>
      {globalError && <ErrorBanner message={globalError} />}

      <FormField
        label={tForm('email_label')}
        value={email}
        editable={false}
        icon="mail"
        iconPosition="start"
        style={styles.readOnlyInput}
      />

      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label={t('display_name_label')}
            autoComplete="name"
            icon="user"
            iconPosition="start"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.displayName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label={t('username_label')}
            autoComplete="username"
            autoCapitalize="none"
            icon="at"
            iconPosition="start"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={fieldRecipe.base.wrapper}>
            <View style={fieldRecipe.base.labelRow}>
              <Text style={fieldRecipe.base.label}>{t('bio_label')}</Text>
            </View>
            <Textarea
              placeholder={t('bio_placeholder')}
              numberOfLines={3}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
            {errors.bio && <Text style={fieldRecipe.base.errorText}>{errors.bio.message}</Text>}
          </View>
        )}
      />

      <View style={styles.footerRow}>
        <Button fullWidth disabled={isPending} loading={isPending} onPress={handleSubmit(onSubmit)}>
          {isPending ? t('saving') : t('save')}
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
