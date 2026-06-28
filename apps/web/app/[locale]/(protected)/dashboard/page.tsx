import { LogoutButton } from '@/components/auth/LogoutButton'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'

export default function Dashboard() {
  return (
    <div className="w-full h-screen p-6 flex flex-col justify-center items-center gap-6 bg-background">
      <p>Dashboard Page</p>
      <LogoutButton />
      <div className="flex items-center justify-center gap-3 w-fit bg-accent rounded-full p-1">
        <ThemeDropdownMenu />
        <LocaleDropdownMenu />
      </div>
    </div>
  )
}
