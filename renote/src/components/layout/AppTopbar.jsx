import { useState } from "react"
import { UserButton, useUser } from "@clerk/clerk-react"
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router"
import {
  Bell,
  BookOpen,
  Bot,
  Circle,
  Compass,
  FolderOpen,
  KeyRound,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  Archive,
  User,
} from "lucide-react"

import { renoteUserButtonAppearance } from "@/components/auth/clerkAppearance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { appNavItems } from "@/data/navigation"
import useTheme from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

const mobileNavIcons = {
  "AI Summaries": Bot,
  "Access Requests": KeyRound,
  "Archive / Trash": Archive,
  Collections: FolderOpen,
  Explore: Compass,
  Home: LayoutDashboard,
  "My Repositories": BookOpen,
  Notifications: Bell,
  Profile: User,
}

function isActivePath(pathname, href) {
  const currentPath = pathname.replace(/\/+$/, "")
  const itemPath = href.replace(/\/+$/, "")

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

function isActiveRoute(pathname, item) {
  const activeHrefs = item.activeHrefs ?? [item.href]

  return activeHrefs.some((href) => isActivePath(pathname, href))
}

function AppTopbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [localSearch, setLocalSearch] = useState("")
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user } = useUser()
  const isDark = theme === "dark"
  const isAppExplore = location.pathname === "/app/explore"
  const exploreSearchQuery = searchParams.get("q") ?? ""
  const searchValue = isAppExplore ? exploreSearchQuery : localSearch
  const displayName = user?.firstName ?? user?.fullName ?? "ReNote User"

  function handleSearchChange(event) {
    const value = event.target.value

    if (!isAppExplore) {
      setLocalSearch(value)
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)

    if (value.trim()) {
      nextSearchParams.set("q", value)
    } else {
      nextSearchParams.delete("q")
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    const query = searchValue.trim()

    if (!query) {
      setLocalSearch("")
      navigate("/app/explore")
      return
    }

    navigate(`/app/explore?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-16 shrink-0 items-center gap-3 border-b bg-background/90 px-4 shadow-sm backdrop-blur lg:px-6">
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button
            aria-label="Open app navigation"
            className="lg:hidden"
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[19rem] max-w-[calc(100vw-1.5rem)] p-0"
          side="left"
        >
          <SheetHeader className="border-b px-5 py-5 text-left">
            <SheetTitle className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
                R
              </span>
              ReNote
            </SheetTitle>
            <SheetDescription>Workspace navigation</SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-2 px-4 py-5">
            {appNavItems.map((item) => {
              const Icon = mobileNavIcons[item.label] ?? Circle
              const isActive = isActiveRoute(location.pathname, item)

              return (
                <SheetClose asChild key={item.href}>
                  <NavLink
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/35",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    to={item.href}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </SheetClose>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="truncate text-lg font-semibold leading-tight">ReNote</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <form
          className="hidden w-[420px] max-w-md lg:block"
          onSubmit={handleSearchSubmit}
        >
          <div className="renote-input-shell">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              onChange={handleSearchChange}
              placeholder="Search repositories"
              type="search"
              value={searchValue}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
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
                asChild
                aria-label="Open notifications"
                className="relative text-muted-foreground hover:text-foreground"
                size="icon"
                variant="ghost"
              >
                <Link to="/app/notifications">
                  <Bell className="size-5" />
                  <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <div className="hidden max-w-36 text-right xl:block">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={renoteUserButtonAppearance}
          >
          </UserButton>
        </div>
      </div>
    </header>
  )
}

export default AppTopbar
