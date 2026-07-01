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
import type { IconName } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

interface NavbarUserMenuProps {
  displayName: string
  email: string
  avatarUrl: string | null
}

interface NavMenuItem {
  key: 'account' | 'billing'
  icon: IconName
  href: string
}

const NAV_MENU_ITEMS: NavMenuItem[] = [
  { key: 'account', icon: 'user', href: routes.account },
  { key: 'billing', icon: 'credit-card', href: routes.billing },
]

export function NavbarUserMenu({ displayName, email, avatarUrl }: NavbarUserMenuProps) {
  const { signOut } = useClerk()
  const router = useRouter()
  const t = useTranslations('nav')

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
          {NAV_MENU_ITEMS.map((item) => (
            <DropdownMenuItem key={item.key} onClick={() => router.push(item.href)}>
              <Icon name={item.icon} size="sm" />
              {t(item.key)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut(() => router.push(routes.signIn))}
        >
          <Icon name="logout" size="sm" />
          {t('sign_out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
