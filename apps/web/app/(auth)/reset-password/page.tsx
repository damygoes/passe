import Link from 'next/link'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code from your email and choose a new password.
        </p>
      </div>

      <ResetPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="font-medium text-primary transition-opacity hover:opacity-70">
          Resend reset code
        </Link>
      </p>
    </div>
  )
}
