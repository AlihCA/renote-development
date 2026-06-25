import { useEffect, useState } from "react"
import { NavLink } from "react-router"
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
  Palette,
  User,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { appNavItems } from "@/data/navigation"
import { cn } from "@/lib/utils"

const SIDEBAR_STORAGE_KEY = "renote-sidebar-collapsed"

const sidebarIcons = {
  "AI Summaries": Bot,
  "Access Requests": KeyRound,
  "Archive / Trash": Archive,
  Collections: FolderOpen,
  Dashboard: LayoutDashboard,
  "Design System": Palette,
  Explore: Compass,
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

function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(getStoredSidebarState)

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed))
  }, [isCollapsed])

  return (
    <aside
      className={cn(
        "sidebar-gradient relative hidden h-svh shrink-0 overflow-hidden border-r border-[#E9C8F2] text-[#32103F] transition-[width] duration-300 ease-out dark:border-[#5D2B74] dark:text-white lg:flex",
        isCollapsed ? "w-[4.75rem]" : "w-[17rem]"
      )}
    >
      <div
        className={cn(
          "relative z-10 flex min-h-0 w-full flex-col",
          isCollapsed ? "items-center px-3 py-5" : "p-5"
        )}
      >
        <div
          className={cn(
            "mb-7 flex w-full items-center",
            isCollapsed ? "flex-col gap-3" : "gap-3"
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2] bg-[#A855F7] font-semibold text-white shadow-sm shadow-fuchsia-200/60 dark:border-[#AA3BC3]/40 dark:bg-[#AA3BC3] dark:shadow-none">
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
              "grid shrink-0 place-items-center rounded-xl border border-[#E9C8F2] bg-white/55 text-[#32103F] shadow-sm transition hover:border-[#DDADE9] hover:bg-[#F7E5FF] hover:text-[#32103F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]/30 dark:border-[#5D2B74] dark:bg-[#32103F] dark:text-[#F8EFFC] dark:shadow-none dark:hover:border-[#AA3BC3] dark:hover:bg-[#48146E] dark:hover:text-white dark:focus-visible:ring-[#AA3BC3]/45",
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
              ? "flex flex-1 flex-col items-center gap-2 overflow-x-hidden"
              : "flex w-full flex-1 flex-col items-stretch gap-2 overflow-x-hidden"
          }
        >
          {appNavItems.map((item) => {
            const Icon = sidebarIcons[item.label] ?? Circle

            return isCollapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <NavLink
                    aria-label={item.label}
                    className={({ isActive }) =>
                      cn(
                        "mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] border border-transparent p-0 shadow-none outline-none transition focus-visible:ring-2 focus-visible:ring-[#B43BD1]/35",
                        isActive
                          ? "bg-[#B43BD1] text-white"
                          : "bg-transparent text-[#5E216F] hover:bg-[#F7D9FF] hover:text-[#9F2CC2] dark:text-[#E7D3EF] dark:hover:bg-white/10 dark:hover:text-white"
                      )
                    }
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
                className={({ isActive }) =>
                  cn(
                    "flex h-11 w-full items-center justify-start gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[#B43BD1]/35",
                    isActive
                      ? "border-transparent bg-[#B43BD1] text-white shadow-none"
                      : "border-transparent text-[#5E216F] hover:bg-[#F7D9FF] hover:text-[#32103F] dark:text-[#E7D3EF] dark:hover:bg-white/10 dark:hover:text-white"
                  )
                }
                key={item.href}
                to={item.href}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
