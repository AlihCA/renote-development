import { APP_ROLES, canAccessRole } from "../lib/roles.js"
import { APP_PAGE_ACCESS } from "../routes/appPageAccess.js"

export const publicNavItems = [{ label: "Home", href: "/" }]

const items = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    href: "/app/dashboard",
    allowedRoles: APP_PAGE_ACCESS.DASHBOARD,
  },
  courses: {
    id: "courses",
    label: "My Courses",
    href: "/app/courses",
    activeHrefs: ["/app/courses", "/app/workspace", "/app/files", "/app/summaries"],
    allowedRoles: APP_PAGE_ACCESS.COURSES,
  },
  search: {
    id: "search",
    label: "Search",
    href: "/app/search",
    allowedRoles: APP_PAGE_ACCESS.SEARCH,
  },
  notifications: {
    id: "notifications",
    label: "Notifications",
    href: "/app/notifications",
    allowedRoles: APP_PAGE_ACCESS.NOTIFICATIONS,
  },
  materials: {
    id: "materials",
    label: "Materials",
    href: "/app/materials",
    allowedRoles: APP_PAGE_ACCESS.MATERIALS,
  },
  users: {
    id: "users",
    label: "Users",
    href: "/app/admin/users",
    allowedRoles: APP_PAGE_ACCESS.ADMIN,
  },
  content: {
    id: "content",
    label: "Content",
    href: "/app/admin/content",
    allowedRoles: APP_PAGE_ACCESS.ADMIN,
  },
  usage: {
    id: "usage",
    label: "Usage",
    href: "/app/admin/usage",
    allowedRoles: APP_PAGE_ACCESS.ADMIN,
  },
  aiUsage: {
    id: "aiUsage",
    label: "AI Usage",
    href: "/app/admin/ai-usage",
    allowedRoles: APP_PAGE_ACCESS.ADMIN,
  },
  settings: {
    id: "settings",
    label: "Settings",
    href: "/app/settings",
    allowedRoles: APP_PAGE_ACCESS.SETTINGS,
  },
}

const sectionIdsByRole = {
  [APP_ROLES.STUDENT]: [
    { title: "Learning", items: ["dashboard", "courses", "search", "notifications"] },
    { title: "Account", items: ["settings"] },
  ],
  [APP_ROLES.FACULTY]: [
    { title: "Teaching", items: ["dashboard", "courses", "materials"] },
    { title: "Account", items: ["settings"] },
  ],
  [APP_ROLES.ADMIN]: [
    { title: "Platform", items: ["dashboard", "users", "content", "usage", "aiUsage"] },
    { title: "Account", items: ["settings"] },
  ],
}

export const appSearchDestinations = {
  [APP_ROLES.STUDENT]: items.search.href,
  [APP_ROLES.FACULTY]: items.materials.href,
}

export function getAppNavSections(role) {
  return (sectionIdsByRole[role] ?? []).map((section) => ({
    title: section.title,
    items: section.items
      .map((id) => items[id])
      .filter((item) => canAccessRole(role, item.allowedRoles)),
  }))
}

export function getAppNavItems(role) {
  return getAppNavSections(role).flatMap((section) => section.items)
}
