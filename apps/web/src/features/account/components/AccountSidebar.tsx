'use client'

import { Icon } from '@passe/ui/icon'
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
          <button
            key={item.key}
            type="button"
            onClick={() => onTabChange(item.key)}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 text-left whitespace-nowrap',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground',
              item.key === 'danger' && isActive && 'text-destructive',
              item.key === 'danger' && !isActive && 'hover:text-destructive',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              name={item.icon}
              size="sm"
              className={cn(
                item.key === 'danger' ? 'text-destructive' : undefined,
              )}
            />
            {t(item.key)}
          </button>
        )
      })}
    </nav>
  )
}
