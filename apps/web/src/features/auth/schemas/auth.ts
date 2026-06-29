import { z } from 'zod'

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number (0–9)', test: (p: string) => /[0-9]/.test(p) },
  {
    id: 'special',
    label: 'One special character (!@#$…)',
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const

export const SignInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const SignUpSchema = z
  .object({
    displayName: z.string().min(1, 'Display name is required').max(50, 'Max 50 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const OTPSchema = z.object({
  code: z.string().length(6, 'Enter the 6-digit code'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export const ResetPasswordSchema = z.object({
  code: z.string().length(6, 'Enter the 6-digit code'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
})

export type SignInFormValues = z.infer<typeof SignInSchema>
export type SignUpFormValues = z.infer<typeof SignUpSchema>
export type OTPFormValues = z.infer<typeof OTPSchema>
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>
