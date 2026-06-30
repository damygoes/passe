'use client'

import { useClerk } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@passe/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import { SIGN_IN_URL } from '@passe/auth/constants'
import { useRouter } from '@/i18n/navigation'

interface NavbarUserMenuProps {
  displayName: string
  email: string
  avatarUrl: string | null
}

export function NavbarUserMenu({ displayName, email, avatarUrl }: NavbarUserMenuProps) {
  const { signOut } = useClerk()
  const router = useRouter()

  const initials = displayName
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="grid min-w-0 max-w-32 flex-1 leading-tight">
          <span className="truncate text-sm font-medium">{displayName}</span>
        </span>
        <Icon name="chevron-up-down" size="xs" className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Identity header */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            <Avatar size="default">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-sm font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icon name="user" size="sm" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="credit-card" size="sm" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut(() => router.push(SIGN_IN_URL))}
        >
          <Icon name="logout" size="sm" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
