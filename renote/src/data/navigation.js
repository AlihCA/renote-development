export const publicNavItems = [
  { label: "Home", href: "/" },
]

export const appNavSections = [
  {
    title: "Home",
    items: [{ label: "Home", href: "/app/dashboard" }],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "Materials",
        href: "/app/my-repositories",
        activeHrefs: ["/app/my-repositories", "/app/workspace", "/app/files"],
      },
    ],
  },
  {
    title: "Activity",
    items: [
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
