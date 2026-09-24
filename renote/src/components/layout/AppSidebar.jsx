import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router"
import {
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import renoteLogo from "@/assets/brand/renote-logo.png"
import { appNavIcons } from "@/components/layout/appNavIcons"
import { getAppNavSections } from "@/data/navigation"
import useApplicationUser from "@/hooks/useApplicationUser"
import { cn } from "@/lib/utils"

const SIDEBAR_STORAGE_KEY = "renote-sidebar-collapsed"

function getStoredSidebarState() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
  } catch {
    return false
  }
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

function AppSidebar() {
  const location = useLocation()
  const { appUser } = useApplicationUser()
  const [isCollapsed, setIsCollapsed] = useState(getStoredSidebarState)
  const appNavSections = getAppNavSections(appUser?.role)

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed))
  }, [isCollapsed])

  return (
    <aside
      className={cn(
        "sidebar-gradient relative hidden h-svh shrink-0 overflow-hidden border-r border-sidebar-border text-sidebar-foreground transition-[width] duration-300 ease-out lg:flex",
        isCollapsed ? "w-[4.75rem]" : "w-[16.5rem]"
      )}
    >
      <div
        className={cn(
          "relative z-10 flex min-h-0 w-full flex-col",
          isCollapsed ? "items-center px-3 py-4" : "p-4"
        )}
      >
        <div
          className={cn(
            "mb-5 flex w-full items-center",
            isCollapsed ? "flex-col gap-3" : "gap-3"
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <img
              alt="ReNote logo"
              className="size-9 object-contain"
              src={renoteLogo}
            />
          </span>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="font-semibold leading-none tracking-tight text-primary">ReNote</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {appNavSections[0]?.title ?? "Workspace"}
              </p>
            </div>
          ) : null}
          <button
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "grid shrink-0 place-items-center rounded-lg border border-sidebar-border bg-card text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
              isCollapsed ? "size-10" : "size-9",
              !isCollapsed && "ml-auto"
            )}
            onClick={() => setIsCollapsed((current) => !current)}
            type="button"
          >
            {isCollapsed ? (
              <ChevronRight aria-hidden="true" className="size-4" />
            ) : (
              <ChevronLeft aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>

        <nav
          className={
            isCollapsed
              ? "flex flex-1 flex-col items-center gap-2.5 overflow-x-hidden overflow-y-auto"
              : "flex w-full flex-1 flex-col items-stretch gap-3 overflow-x-hidden overflow-y-auto"
          }
        >
          {appNavSections.map((section, sectionIndex) => (
            <div
              className={cn(
                "flex w-full flex-col",
                isCollapsed ? "items-center gap-2" : "gap-1.5",
                sectionIndex > 0 &&
                  (isCollapsed
                    ? "pt-1.5"
                    : "border-t border-sidebar-border pt-2.5")
              )}
              key={section.title}
            >
              {!isCollapsed ? (
                <p className="px-3 pb-1 text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section.title}
                </p>
              ) : null}

              {section.items.map((item) => {
                const Icon = appNavIcons[item.id] ?? Circle
                const isActive = isActiveRoute(location.pathname, item)

                return isCollapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <NavLink
                        aria-label={item.label}
                        className={cn(
                          "relative mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-transparent p-0 outline-none transition focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        to={item.href}
                      >
                        <Icon aria-hidden="true" className="size-5 shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    className={cn(
                      "relative flex h-10 w-full items-center justify-start gap-2.5 rounded-lg border px-3 py-2 text-[0.82rem] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sidebar-ring/40",
                      isActive
                        ? "border-transparent bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
                        : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    key={item.href}
                    to={item.href}
                  >
                    <Icon aria-hidden="true" className="size-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
