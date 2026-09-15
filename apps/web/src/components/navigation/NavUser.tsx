'use client'

import { useRouter } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useClerk } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@passe/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import type { IconName } from '@passe/ui/icon'
import { Icon } from '@passe/ui/icon'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@passe/ui/sidebar'
import { useTranslations } from 'next-intl'
import { LocaleDropdownMenu } from '../shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '../shared/ThemeDropdownMenu'

interface NavUserProps {
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

export function NavUser({ displayName, email, avatarUrl }: NavUserProps) {
  const { signOut } = useClerk()
  const router = useRouter()
  const t = useTranslations('nav')
  const { isMobile } = useSidebar()

  const initials = displayName
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              >
                <Avatar className="size-8 rounded-lg">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </span>
                <Icon name="chevron-up-down" size="xs" className="ml-auto" />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
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

            <DropdownMenuGroup>
              <DropdownMenuLabel>{t('view')}</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon name="palette" />
                  {t('theme')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{t('appearance')}</DropdownMenuLabel>
                      <ThemeDropdownMenu variant="sidebar-menu" />
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>{t('preferences')}</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon name="languages" />
                  {t('language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <LocaleDropdownMenu variant="sidebar-menu" />
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
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
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
