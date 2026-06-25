import { Link } from "react-router"
import { ArrowUpRight, Bell, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function ActivityItem({ icon: Icon, item, label }) {
  if (!item) {
    return (
      <div className="rounded-3xl border bg-background/75 p-4 text-sm text-muted-foreground">
        No recent {label.toLowerCase()}.
      </div>
    )
  }

  return (
    <div className="rounded-3xl border bg-background/75 p-4">
      <div className="flex items-start gap-3">
        <span className="renote-icon-container size-9">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {label}
          </p>
          <h3 className="font-semibold">{item.title ?? item.repositoryTitle}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {item.message ?? item.reason}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

function ActivitySnapshot({
  latestNotification,
  latestRequest,
}) {
  return (
    <section className="renote-card self-start space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Activity Snapshot
        </h2>
        <p className="text-sm text-muted-foreground">
          Notifications and access requests that may need attention.
        </p>
      </div>

      <div className="space-y-3">
        <ActivityItem
          icon={Bell}
          item={latestNotification}
          label="Latest notification"
        />
        <ActivityItem
          icon={KeyRound}
          item={latestRequest}
          label="Latest request"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link to="/app/notifications">
            Notifications
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link to="/app/access-requests">
            Access Requests
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default ActivitySnapshot
