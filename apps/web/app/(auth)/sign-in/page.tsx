import Link from 'next/link'
import { Separator } from '@passe/ui/separator'
import { SignInForm } from '@/components/auth/SignInForm'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your Passé account</p>
      </div>

      <SocialAuthButtons mode="sign-in" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <Separator className="flex-1" />
      </div>

      <SignInForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-primary transition-opacity hover:opacity-70">
          Sign up
        </Link>
      </p>
    </div>
  )
}
