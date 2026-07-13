'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { publicPortfolioRoute, routes } from '@/lib/routes'
import { useUser } from '@passe/hooks'
import { Icon } from '@passe/ui/icon'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@passe/ui/sidebar'
import { useTranslations } from 'next-intl'

interface SidebarNavProps {
  username: string | null
}

export function SidebarNav({ username: initialUsername }: SidebarNavProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { data: user } = useUser()
  const username = user?.username ?? initialUsername

  return (
    <SidebarGroup>
      <SidebarGroupContent className="my-6">
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === routes.dashboard}
              tooltip={t('dashboard')}
              render={<Link href={routes.dashboard} />}
            >
              <Icon name="layout" />
              <span>{t('dashboard')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === routes.map}
              tooltip={t('map')}
              render={<Link href={routes.map} />}
            >
              <Icon name="map" />
              <span>{t('map')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {username && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={t('portfolio')}
                render={<a href={publicPortfolioRoute(username)} />}
              >
                <Icon name="globe" />
                <span>{t('portfolio')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
