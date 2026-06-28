import { LogoutButton } from '@/components/auth/LogoutButton'

export default function Dashboard() {
  return (
    <div className="w-full h-screen p-6 flex flex-col justify-center items-center gap-6 bg-background">
      <p>Dashboard Page</p>
      <LogoutButton />
    </div>
  )
}
