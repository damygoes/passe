'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { publicPortfolioRoute, routes, tripKeepsakesRoute } from '@/lib/routes'
import { useTrips, useUser } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@passe/ui/sidebar'
import { cn, getMostRecentTrip } from '@passe/utils'
import { useTranslations } from 'next-intl'

interface SidebarNavProps {
  username: string | null
}

// Dot + label, terracotta-tinted pill when active — no icons, per the
// redesign's nav spec (the prototype's sidebar items are literally just a
// colored dot and text, not an icon set).
function NavDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn('size-2 shrink-0 rounded-full', active ? 'bg-terracotta' : 'bg-border')}
      aria-hidden
    />
  )
}

export function SidebarNav({ username: initialUsername }: SidebarNavProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { data: user } = useUser()
  const { data: trips = [] } = useTrips()
  const username = user?.username ?? initialUsername

  const mostRecentTrip = getMostRecentTrip(trips)
  const keepsakesHref = mostRecentTrip ? tripKeepsakesRoute(mostRecentTrip.id) : routes.tripsNew

  const navItems = [
    { key: 'home' as const, href: routes.dashboard },
    { key: 'trips' as const, href: routes.trips },
    { key: 'map' as const, href: routes.map },
    { key: 'stats' as const, href: routes.stats },
    { key: 'keepsakes' as const, href: keepsakesHref },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent className="my-6 flex flex-col gap-4">
        <SidebarMenu className="gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={t(item.key)}
                  className={cn(
                    'rounded-full',
                    isActive &&
                      'bg-terracotta/12 text-terracotta-dark data-active:bg-terracotta/12 data-active:text-terracotta-dark',
                  )}
                  render={<Link href={item.href} />}
                >
                  <NavDot active={isActive} />
                  <span>{t(item.key)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          {username && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={false}
                tooltip={t('portfolio')}
                className="rounded-full"
                render={<a href={publicPortfolioRoute(username)} />}
              >
                <NavDot active={false} />
                <span>{t('portfolio')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        <Link href={routes.tripsNew} className={cn(buttonVariants(), 'w-full')}>
          {t('new_trip')}
        </Link>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
