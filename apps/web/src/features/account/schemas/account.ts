import { UpdateUserSchema } from '@passe/types'
import { z } from 'zod'

export { UpdateUserSchema }
export type ProfileFormValues = z.infer<typeof UpdateUserSchema>

export const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type PasswordFormValues = z.infer<typeof PasswordSchema>
