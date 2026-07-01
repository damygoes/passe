'use client'

import { Button } from '@passe/ui'
import type { IconName } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'

export type AccountTab = 'profile' | 'security' | 'danger'

interface SidebarItem {
  key: AccountTab
  icon: IconName
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'profile', icon: 'user' },
  { key: 'security', icon: 'lock' },
  { key: 'danger', icon: 'alert' },
]

interface AccountSidebarProps {
  activeTab: AccountTab
  onTabChange: (tab: AccountTab) => void
}

export function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const t = useTranslations('account.tabs')

  return (
    <nav
      aria-label="Account settings navigation"
      className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible w-full md:w-52 md:shrink-0 pb-1 md:pb-0"
    >
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = activeTab === item.key
        return (
          <Button
            key={item.key}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => onTabChange(item.key)}
            className={cn(
              'gap-2.5 transition-colors duration-200 text-muted-foreground',
              item.key === 'danger' && isActive && 'text-destructive',
              item.key === 'danger' && !isActive && 'hover:text-destructive',
            )}
            aria-current={isActive ? 'page' : undefined}
            icon={item.icon}
            iconProps={{
              color: item.key === 'danger' ? '#ef4444' : undefined,
            }}
          >
            {t(item.key)}
          </Button>
        )
      })}
    </nav>
  )
}
