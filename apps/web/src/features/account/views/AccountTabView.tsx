'use client'

import { useState } from 'react'
import { AccountSidebar, type AccountTab } from '../components/AccountSidebar'
import { AccountTabViewDataWrapper } from '../components/AccountTabViewDataWrapper'

export function AccountTabView() {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 min-w-0">
        <AccountTabViewDataWrapper activeTab={activeTab} />
      </div>
    </div>
  )
}
