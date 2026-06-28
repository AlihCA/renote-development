export const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore-public" },
  { label: "Help", href: "/help" },
]

export const appNavSections = [
  {
    title: "Home",
    items: [{ label: "Home", href: "/app/dashboard" }],
  },
  {
    title: "Library",
    items: [
      {
        label: "Explore",
        href: "/app/explore",
        activeHrefs: ["/app/explore", "/app/repositories"],
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "My Repositories",
        href: "/app/my-repositories",
        activeHrefs: ["/app/my-repositories", "/app/workspace", "/app/files"],
      },
      { label: "Collections", href: "/app/collections" },
    ],
  },
  {
    title: "Activity",
    items: [
      { label: "AI Summaries", href: "/app/summaries" },
      { label: "Access Requests", href: "/app/access-requests" },
      { label: "Notifications", href: "/app/notifications" },
      { label: "Archive / Trash", href: "/app/archive" },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/app/profile" }],
  },
]

export const appNavItems = appNavSections.flatMap((section) => section.items)
