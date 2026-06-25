import { Link, NavLink } from "react-router"
import { Moon, Search, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { publicNavItems } from "@/data/navigation"
import useTheme from "@/hooks/useTheme"

function PublicNavbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="renote-container flex min-h-16 items-center gap-4">
        <Link className="mr-2 flex items-center gap-2 font-semibold" to="/">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
            R
          </span>
          <span>ReNote</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicNavItems.map((item) => (
            <Button asChild key={item.href} variant="ghost">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "bg-accent text-accent-foreground" : undefined
                }
                to={item.href}
              >
                {item.label}
              </NavLink>
            </Button>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs items-center md:flex">
          <div className="renote-input-shell w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              placeholder="Search notes"
              type="search"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            size="icon"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            variant="ghost"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button asChild variant="ghost">
            <Link to="/role-selection">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/role-selection">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
