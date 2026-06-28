import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router"
import {
  Archive,
  Bell,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Circle,
  Compass,
  FolderOpen,
  KeyRound,
  LayoutDashboard,
  User,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { appNavSections } from "@/data/navigation"
import { cn } from "@/lib/utils"

const SIDEBAR_STORAGE_KEY = "renote-sidebar-collapsed"

const sidebarIcons = {
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
  const [isCollapsed, setIsCollapsed] = useState(getStoredSidebarState)

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed))
  }, [isCollapsed])

  return (
    <aside
      className={cn(
        "sidebar-gradient relative hidden h-svh shrink-0 overflow-hidden border-r border-[#E9B8F2] text-[#32103F] transition-[width] duration-300 ease-out dark:border-[#5D2B74] dark:text-white lg:flex",
        isCollapsed ? "w-[4.75rem]" : "w-[17rem]"
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
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#E9B8F2] bg-primary font-semibold text-primary-foreground shadow-sm shadow-fuchsia-200/60 dark:border-primary/40 dark:bg-primary dark:shadow-none">
            R
          </span>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="font-semibold leading-none">ReNote</p>
              <p className="mt-1 truncate text-sm text-[#6F3A7D] dark:text-[#D8C7E3]">
                Workspace
              </p>
            </div>
          ) : null}
          <button
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "grid shrink-0 place-items-center rounded-xl border border-[#E9B8F2] bg-white/55 text-[#32103F] shadow-sm transition hover:border-[#E9B8F2] hover:bg-[#F8D7FF] hover:text-[#32103F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:border-[#5D2B74] dark:bg-[#32103F] dark:text-[#F8EFFC] dark:shadow-none dark:hover:border-primary/60 dark:hover:bg-[#48146E] dark:hover:text-white dark:focus-visible:ring-primary/45",
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
                    : "border-t border-[#E9B8F2]/45 pt-2.5 dark:border-[#5D2B74]/45")
              )}
              key={section.title}
            >
              {!isCollapsed ? (
                <p className="px-3 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8A5798] dark:text-[#CDB4DC]">
                  {section.title}
                </p>
              ) : null}

              {section.items.map((item) => {
                const Icon = sidebarIcons[item.label] ?? Circle
                const isActive = isActiveRoute(location.pathname, item)

                return isCollapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <NavLink
                        aria-label={item.label}
                        className={cn(
                          "mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] border border-transparent p-0 shadow-none outline-none transition focus-visible:ring-2 focus-visible:ring-primary/35",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent text-[#5E216F] hover:bg-[#F8D7FF] hover:text-[#9F2CC2] dark:text-[#E7D3EF] dark:hover:bg-white/10 dark:hover:text-white"
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
                      "flex h-10 w-full items-center justify-start gap-2.5 rounded-2xl border px-3 py-2 text-[0.82rem] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/35",
                      isActive
                        ? "border-transparent bg-primary text-primary-foreground shadow-none"
                        : "border-transparent text-[#5E216F] hover:bg-[#F8D7FF] hover:text-[#9F2CC2] dark:text-[#E7D3EF] dark:hover:bg-white/10 dark:hover:text-white"
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
