import { Bell, Moon, Search, Sun } from "lucide-react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useTheme from "@/hooks/useTheme"

function AppTopbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="sticky top-0 z-30 flex min-h-16 shrink-0 items-center gap-3 border-b bg-background/90 px-4 shadow-sm backdrop-blur lg:px-6">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="truncate text-lg font-semibold leading-tight">ReNote</h1>
      </div>

      <div className="ml-auto hidden w-full max-w-md md:block">
        <div className="renote-input-shell">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
            placeholder="Search repositories"
            type="search"
          />
        </div>
      </div>

      <Button
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="border-border/70 bg-background/80 text-muted-foreground hover:text-foreground"
        onClick={toggleTheme}
        size="icon"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        variant="outline"
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Open notifications"
            className="relative text-muted-foreground hover:text-foreground"
            size="icon"
            variant="ghost"
          >
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-2xl" size="icon" variant="ghost">
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
