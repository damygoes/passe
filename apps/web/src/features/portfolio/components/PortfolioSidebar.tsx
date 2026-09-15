import { Avatar, AvatarFallback, AvatarImage } from '@passe/ui/avatar'

interface UserData {
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
}

interface Props {
  user: UserData
  memberSinceYear: number
  tripCount: number
  countriesCount: number
  citiesCount: number
}

export function PortfolioSidebar({
  user,
  memberSinceYear,
  tripCount,
  countriesCount,
  citiesCount,
}: Props) {
  const initials = user.displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const stats = [
    { value: tripCount, label: 'Trips' },
    { value: countriesCount, label: 'Countries' },
    { value: citiesCount, label: 'Cities' },
  ]

  return (
    <div>
      <Avatar className="size-[180px]">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
        <AvatarFallback className="font-display text-5xl">{initials}</AvatarFallback>
      </Avatar>
      <h1 className="font-display mt-[22px] text-[34px] leading-[1.1]">{user.displayName}</h1>
      <p className="mt-[10px] font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
        Since {memberSinceYear}
      </p>
      {user.bio && (
        <p className="mt-[14px] text-[14.5px] leading-relaxed text-muted-foreground">{user.bio}</p>
      )}
      {tripCount > 0 && (
        <div className="mt-[22px] flex gap-[22px] border-t pt-[22px]">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[28px] leading-none">{stat.value}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
