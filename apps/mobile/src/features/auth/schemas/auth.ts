import { z } from 'zod'

type TranslateFn = (key: string) => string

export const PASSWORD_RULES = [
  { id: 'length', test: (p: string) => p.length >= 8 },
  { id: 'uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number', test: (p: string) => /[0-9]/.test(p) },
  { id: 'special', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const

export function createSignInSchema(t: TranslateFn) {
  return z.object({
    email: z.string().email(t('invalid_email')),
    password: z.string().min(1, t('password_required')),
  })
}

export function createSignUpSchema(t: TranslateFn) {
  return z
    .object({
      displayName: z
        .string()
        .min(1, t('display_name_required'))
        .max(50, t('display_name_max')),
      email: z.string().email(t('invalid_email')),
      password: z
        .string()
        .min(8, t('password_min_length'))
        .regex(/[A-Z]/, t('password_uppercase'))
        .regex(/[a-z]/, t('password_lowercase'))
        .regex(/[0-9]/, t('password_number'))
        .regex(/[^A-Za-z0-9]/, t('password_special')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t('passwords_no_match'),
      path: ['confirmPassword'],
    })
}

export function createOTPSchema(t: TranslateFn) {
  return z.object({
    code: z.string().length(6, t('otp_length')),
  })
}

export function createForgotPasswordSchema(t: TranslateFn) {
  return z.object({
    email: z.string().email(t('invalid_email')),
  })
}

export function createResetPasswordSchema(t: TranslateFn) {
  return z.object({
    code: z.string().length(6, t('otp_length')),
    password: z
      .string()
      .min(8, t('password_min_length'))
      .regex(/[A-Z]/, t('password_uppercase'))
      .regex(/[a-z]/, t('password_lowercase'))
      .regex(/[0-9]/, t('password_number'))
      .regex(/[^A-Za-z0-9]/, t('password_special')),
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>
export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>
export type OTPFormValues = z.infer<ReturnType<typeof createOTPSchema>>
export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>
