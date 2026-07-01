import { Avatar, AvatarFallback, AvatarImage } from '@passe/ui/avatar'
import { Badge } from '@passe/ui/badge'

interface UserData {
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
}

interface Props {
  user: UserData
  tripCount: number
}

export function PortfolioHeader({ user, tripCount }: Props) {
  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="border-b px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start gap-5">
          <Avatar className="size-16 shrink-0">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Portfolio</p>
            <h1 className="font-heading text-3xl font-semibold">{user.displayName}</h1>
            {user.bio && <p className="mt-2 text-muted-foreground">{user.bio}</p>}
            <div className="mt-3">
              <Badge variant="outline">
                {tripCount} {tripCount === 1 ? 'trip' : 'trips'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
