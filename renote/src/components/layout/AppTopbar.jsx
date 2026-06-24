import { Bell, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

function AppTopbar() {
  return (
    <header className="flex min-h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:px-6">
      <div>
        <p className="text-sm text-muted-foreground">Workspace</p>
        <h1 className="text-lg font-semibold leading-none">ReNote</h1>
      </div>

      <div className="ml-auto hidden w-full max-w-sm md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search repositories" type="search" />
        </div>
      </div>

      <Button aria-label="Open notifications" size="icon" variant="ghost">
        <Bell className="size-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar className="size-8">
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>ReNote User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default AppTopbar
