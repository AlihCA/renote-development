export const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore-public" },
  { label: "Help", href: "/help" },
]

export const appNavItems = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Explore", href: "/app/explore" },
  {
    label: "My Repositories",
    href: "/app/my-repositories",
    activeHrefs: [
      "/app/my-repositories",
      "/app/repositories",
      "/app/workspace",
      "/app/files",
    ],
  },
  { label: "Collections", href: "/app/collections" },
  { label: "AI Summaries", href: "/app/summaries" },
  { label: "Access Requests", href: "/app/access-requests" },
  { label: "Notifications", href: "/app/notifications" },
  { label: "Archive / Trash", href: "/app/archive" },
  { label: "Profile", href: "/app/profile" },
  { label: "Design System", href: "/app/design-system", developmentOnly: true },
]
