import { useState } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { Link, NavLink, useLocation } from "react-router"
import { Menu, Moon, Sun } from "lucide-react"

import renoteLogo from "@/assets/brand/renote-logo.png"
import { renoteUserButtonAppearance } from "@/components/auth/clerkAppearance"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { publicNavItems } from "@/data/navigation"
import useTheme from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

function isActiveRoute(pathname, href) {
  if (href === "/") {
    return pathname === "/"
  }

  const currentPath = pathname.replace(/\/+$/, "")
  const itemPath = href.replace(/\/+$/, "")

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

function PublicNavbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="renote-container flex min-h-16 items-center gap-4">
        <Link className="mr-2 flex items-center gap-2 font-semibold" to="/">
          <span className="flex size-9 shrink-0 items-center justify-center">
            <img
              alt="ReNote logo"
              className="size-9 object-contain"
              src={renoteLogo}
            />
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

        <div className="ml-auto flex items-center gap-2">
          <Button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            size="icon"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            variant="ghost"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <SignedOut>
            <Button asChild className="hidden md:inline-flex" variant="ghost">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="renote-gradient-button hidden border-transparent hover:text-white md:inline-flex">
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild className="hidden md:inline-flex" variant="ghost">
              <Link to="/app/dashboard">Dashboard</Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
              appearance={renoteUserButtonAppearance}
            />
          </SignedIn>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label="Open public navigation"
                className="md:hidden"
                size="icon"
                variant="ghost"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[19rem] max-w-[calc(100vw-1.5rem)] p-0"
              side="right"
            >
              <SheetHeader className="border-b px-5 py-5 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center">
                    <img
                      alt="ReNote logo"
                      className="size-9 object-contain"
                      src={renoteLogo}
                    />
                  </span>
                  ReNote
                </SheetTitle>
                <SheetDescription>Public navigation</SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-2 px-4 py-5">
                {publicNavItems.map((item) => {
                  const isActive = isActiveRoute(location.pathname, item.href)

                  return (
                    <SheetClose asChild key={item.href}>
                      <NavLink
                        className={cn(
                          "flex h-11 items-center rounded-2xl px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/35",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        to={item.href}
                      >
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  )
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t px-4 py-5">
                <SignedOut>
                  <SheetClose asChild>
                    <Link
                      className="flex h-11 items-center justify-center rounded-2xl text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      to="/sign-in"
                    >
                      Sign In
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      className="flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-[var(--renote-primary-hover)]"
                      to="/sign-up"
                    >
                      Sign Up
                    </Link>
                  </SheetClose>
                </SignedOut>
                <SignedIn>
                  <SheetClose asChild>
                    <Link
                      className="flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-[var(--renote-primary-hover)]"
                      to="/app/dashboard"
                    >
                      Dashboard
                    </Link>
                  </SheetClose>
                  <div className="flex items-center justify-between rounded-2xl border bg-background/80 px-3 py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Account
                    </span>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={renoteUserButtonAppearance}
                    />
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default PublicNavbar
