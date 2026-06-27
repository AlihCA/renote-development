import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  Archive,
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCheck,
  FileQuestion,
  FolderOpen,
  KeyRound,
  MoreHorizontal,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockFiles, mockNotifications } from "@/data"
import { cn } from "@/lib/utils"

const initialFilters = {
  sort: "newest",
  tab: "all",
}

const notificationTabs = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Access", value: "access" },
  { label: "Repository", value: "repository" },
  { label: "Summary", value: "summary" },
  { label: "Collection", value: "collection" },
  { label: "System", value: "system" },
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getNotificationCategory(notification) {
  const type = notification.type ?? ""

  if (type.includes("access")) return "access"
  if (type.includes("repository") || notification.relatedType === "repository") {
    return "repository"
  }
  if (type.includes("summary") || notification.relatedType === "summary") {
    return "summary"
  }
  if (type.includes("collection") || notification.relatedType === "collection") {
    return "collection"
  }

  return "system"
}

function getNotificationLink(notification) {
  if (notification.relatedType === "repository") {
    return `/app/repositories/${notification.relatedId}`
  }

  if (notification.relatedType === "summary") {
    return `/app/summaries/${notification.relatedId}`
  }

  if (notification.relatedType === "collection") {
    return `/app/collections/${notification.relatedId}`
  }

  if (notification.relatedType === "file") {
    const file = mockFiles.find((item) => item.id === notification.relatedId)
    return file ? `/app/files/${file.id}` : null
  }

  return null
}

function getCategoryLabel(category) {
  if (category === "access") return "Access"
  if (category === "repository") return "Repository"
  if (category === "summary") return "Summary"
  if (category === "collection") return "Collection"

  return "System"
}

function getCategoryIcon(category) {
  if (category === "access") return KeyRound
  if (category === "repository") return BookOpen
  if (category === "summary") return Sparkles
  if (category === "collection") return FolderOpen

  return Bell
}

function sortNotifications(notifications, sort) {
  return [...notifications].sort((first, second) => {
    if (sort === "oldest") {
      return new Date(first.createdAt) - new Date(second.createdAt)
    }

    return new Date(second.createdAt) - new Date(first.createdAt)
  })
}

function NotificationTypeIcon({ category, isRead }) {
  const Icon = getCategoryIcon(category)

  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-2xl border shadow-sm",
        isRead
          ? "border-[#E9C8F2]/70 bg-white text-muted-foreground dark:border-primary/20 dark:bg-background/60"
          : "border-primary/25 bg-primary/10 text-primary"
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}

function NotificationMoreMenu({ notification, onToggleRead }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="More notification actions" size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notification actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onToggleRead(notification.id)}>
          {notification.isRead ? (
            <RotateCcw className="size-4" />
          ) : (
            <CheckCheck className="size-4" />
          )}
          Mark as {notification.isRead ? "unread" : "read"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast("Archiving notifications will be connected later.")}
          variant="destructive"
        >
          <Archive className="size-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationCard({ notification, onToggleRead }) {
  const category = getNotificationCategory(notification)
  const relatedUrl = getNotificationLink(notification)

  return (
    <article
      className={cn(
        "rounded-lg border p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:hover:bg-primary/5",
        notification.isRead
          ? "border-[#E9C8F2]/80 bg-white dark:border-primary/20 dark:bg-card"
          : "border-primary/25 bg-[#FCF7FF] dark:border-primary/25 dark:bg-primary/10"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-4 size-2 shrink-0 rounded-full",
              notification.isRead ? "bg-transparent" : "bg-primary"
            )}
          />
          <NotificationTypeIcon category={category} isRead={notification.isRead} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold tracking-tight">{notification.title}</h2>
            <Badge
              className="rounded-lg border-[#E9C8F2] bg-white/80 text-xs text-muted-foreground dark:border-primary/20 dark:bg-background/60"
              variant="outline"
            >
              {getCategoryLabel(category)}
            </Badge>
            {!notification.isRead ? (
              <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
                Unread
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {notification.message}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {formatDate(notification.createdAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Button
            onClick={() => onToggleRead(notification.id)}
            size="sm"
            type="button"
            variant="outline"
          >
            {notification.isRead ? "Mark unread" : "Mark read"}
          </Button>
          {relatedUrl ? (
            <Button asChild size="sm" variant="outline">
              <Link to={relatedUrl}>
                Open
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
          <NotificationMoreMenu
            notification={notification}
            onToggleRead={onToggleRead}
          />
        </div>
      </div>
    </article>
  )
}

function NotificationsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = useMemo(() => {
    const filtered = notifications.filter((notification) => {
      if (filters.tab === "all") {
        return true
      }

      if (filters.tab === "unread") {
        return !notification.isRead
      }

      return getNotificationCategory(notification) === filters.tab
    })

    return sortNotifications(filtered, filters.sort)
  }, [filters, notifications])

  const unreadCount = notifications.filter((notification) => !notification.isRead).length
  const readCount = notifications.length - unreadCount

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function markAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    )
    toast("Notifications marked as read.")
  }

  function toggleRead(notificationId) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    )
  }

  function clearReadNotifications() {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => !notification.isRead)
    )
    toast("Read notifications cleared.")
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <>
            <Button onClick={markAllAsRead} type="button" variant="outline">
              <CheckCheck className="size-4" />
              Mark all as read
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="More notification actions" size="icon-sm" variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notification center</DropdownMenuLabel>
                <DropdownMenuItem
                  disabled={readCount === 0}
                  onSelect={clearReadNotifications}
                >
                  Clear read notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        description="Track repository updates, access activity, AI summary events, and study board changes."
        title="Notifications"
      />

      <section className="space-y-3">
        <div className="overflow-x-auto pb-1">
          <Tabs
            onValueChange={(value) => updateFilter("tab", value)}
            value={filters.tab}
          >
            <TabsList className="min-w-max border border-[#E9C8F2]/70 bg-[#FCF7FF] dark:border-primary/20 dark:bg-primary/5">
              {notificationTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                  <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {tab.value === "all"
                      ? notifications.length
                      : tab.value === "unread"
                        ? unreadCount
                        : notifications.filter(
                            (notification) =>
                              getNotificationCategory(notification) === tab.value
                          ).length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} notifications. {unreadCount} unread.
          </p>

          <Select
            onValueChange={(value) => updateFilter("sort", value)}
            value={filters.sort}
          >
            <SelectTrigger className="w-full border-border bg-background/80 sm:w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onToggleRead={toggleRead}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button onClick={clearFilters} type="button">
              Clear filters
            </Button>
          }
          description="Repository updates, access activity, and AI summary events will appear here."
          icon={FileQuestion}
          title="No notifications found"
        />
      )}
    </PageShell>
  )
}

export default NotificationsPage
