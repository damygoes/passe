import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Button,
  Input,
  Textarea,
} from '@passe/ui'

export function AvatarDemo() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge className="bg-deep-olive dark:bg-deep-olive-light" />
      </Avatar>
      <AvatarGroup className="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

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
        <AvatarDemo />
      </div>
    </div>
  )
}
