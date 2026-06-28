import Link from 'next/link'
import { Separator } from '@passe/ui/separator'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">Start preserving your memories with Passé</p>
      </div>

      <SocialAuthButtons mode="sign-up" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <Separator className="flex-1" />
      </div>

      <SignUpForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary transition-opacity hover:opacity-70">
          Sign in
        </Link>
      </p>
    </div>
  )
}
