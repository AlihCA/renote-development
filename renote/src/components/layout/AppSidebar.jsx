import { NavLink } from "react-router"
import { BookOpen, Compass, LayoutDashboard } from "lucide-react"

import { appNavItems } from "@/data/navigation"

const sidebarIcons = {
  Dashboard: LayoutDashboard,
  Explore: Compass,
  "My Repositories": BookOpen,
}

function AppSidebar() {
  return (
    <aside className="sidebar-gradient hidden min-h-svh w-72 shrink-0 flex-col p-5 text-sidebar-foreground lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-white/95 font-semibold text-violet-700">
          R
        </span>
        <div>
          <p className="font-semibold leading-none">ReNote</p>
          <p className="text-sm text-white/75">Academic workspace</p>
        </div>
      </div>

      <nav className="space-y-2">
        {appNavItems.map((item) => {
          const Icon = sidebarIcons[item.label]

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-violet-800 shadow-sm"
                    : "text-white/85 hover:bg-white/15 hover:text-white",
                ].join(" ")
              }
              key={item.href}
              to={item.href}
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default AppSidebar
