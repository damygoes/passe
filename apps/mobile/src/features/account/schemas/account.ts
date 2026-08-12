import { z } from 'zod'

type TranslateFn = (key: string) => string

export function createProfileSchema(t: TranslateFn) {
  return z.object({
    displayName: z.string().min(1, t('display_name_required')).max(50, t('display_name_max')),
    username: z.string().min(3, t('username_min')).max(40, t('username_max')),
    bio: z.string().max(160, t('bio_max')),
  })
}

export function createPasswordSchema(t: TranslateFn) {
  return z
    .object({
      currentPassword: z.string().min(1, t('password_required')),
      newPassword: z
        .string()
        .min(8, t('password_min_length'))
        .regex(/[A-Z]/, t('password_uppercase'))
        .regex(/[a-z]/, t('password_lowercase'))
        .regex(/[0-9]/, t('password_number'))
        .regex(/[^A-Za-z0-9]/, t('password_special')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('passwords_no_match'),
      path: ['confirmPassword'],
    })
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
export type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>
