import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'

interface PasswordMatchIndicatorProps {
  password: string
  confirmPassword: string
  className?: string
}

export function PasswordMatchIndicator({
  password,
  confirmPassword,
  className,
}: PasswordMatchIndicatorProps) {
  if (!password || !confirmPassword) return null

  const matches = password === confirmPassword

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-1.5 text-xs transition-colors duration-200',
        matches ? 'text-deep-olive' : 'text-destructive',
        className,
      )}
    >
      <Icon name={matches ? 'check' : 'close'} size="xs" aria-hidden />
      {matches ? 'Passwords match' : "Passwords don't match"}
    </div>
  )
}
