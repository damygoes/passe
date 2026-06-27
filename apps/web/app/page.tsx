import { Button } from '@repo/ui/button'
import { Textarea } from '@repo/ui/components/textarea/Textarea'
import { Input } from '@repo/ui/input'

export default function Home() {
  return (
    <div className="w-full h-svh bg-aged-cream gap-4 flex flex-col p-4">
      <h1 className="text-3xl">Welcome to the Web App</h1>
      <div className="w-1/2 space-y-5">
        <Button icon="alert" size="lg">
          Get Started
        </Button>
        <Input placeholder="What are you thinking about?" icon="check" iconPosition="end" />
        <Textarea placeholder="What are you thinking about?" />
      </div>
    </div>
  )
}
