import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  MoreHorizontal,
  Plus,
  Send,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
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
import { mockAccessRequests, mockRepositories, mockUsers } from "@/data"
import { cn } from "@/lib/utils"

const currentUserId = "user-student-mia"

const initialFilters = {
  scope: "received",
  sort: "newest",
  status: "all",
}

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Denied", value: "denied" },
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toTitleCase(value) {
  return String(value ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getUser(userId, fallbackName) {
  return (
    mockUsers.find((user) => user.id === userId) ?? {
      avatarInitials: fallbackName
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 3),
      name: fallbackName ?? "ReNote User",
      role: "guest",
      trustLabel: "community",
    }
  )
}

function getRepository(repositoryId, fallbackTitle) {
  return (
    mockRepositories.find((repository) => repository.id === repositoryId) ?? {
      id: repositoryId,
      ownerName: "Repository owner unavailable",
      title: fallbackTitle ?? "Repository unavailable",
      trustLabel: "community",
      visibility: "restricted",
    }
  )
}

function normalizeStatus(status) {
  if (["declined", "denied", "rejected"].includes(status)) {
    return "denied"
  }

  return status ?? "pending"
}

function getStatusLabel(status) {
  return toTitleCase(normalizeStatus(status))
}

function StatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status)
  const Icon =
    normalizedStatus === "approved"
      ? CheckCircle2
      : normalizedStatus === "denied"
        ? XCircle
        : Clock3

  return (
    <Badge
      className={cn(
        "rounded-lg px-2.5 py-1",
        normalizedStatus === "approved" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
        normalizedStatus === "denied" &&
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300",
        normalizedStatus === "pending" &&
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
      )}
      variant="outline"
    >
      <Icon className="size-3" />
      {getStatusLabel(status)}
    </Badge>
  )
}

function AvatarInitials({ user }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/80 bg-[#FCF7FF] text-sm font-semibold text-primary shadow-sm dark:border-primary/20 dark:bg-primary/5">
      {user.avatarInitials ?? "RN"}
    </span>
  )
}

function sortRequests(requests, sort) {
  return [...requests].sort((first, second) => {
    if (sort === "oldest") {
      return new Date(first.createdAt) - new Date(second.createdAt)
    }

    if (sort === "repository") {
      return first.repositoryTitle.localeCompare(second.repositoryTitle)
    }

    if (sort === "requester") {
      return first.requesterName.localeCompare(second.requesterName)
    }

    return new Date(second.createdAt) - new Date(first.createdAt)
  })
}

function RequestMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="More request actions" size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Request actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Request notes will be connected later.")}>
          Add note
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Sharing request context will be connected later.")}>
          Share context
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast("Archiving requests will be connected later.")}
          variant="destructive"
        >
          Archive request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ReceivedRequestCard({ onUpdateStatus, request }) {
  const requester = getUser(request.requesterId, request.requesterName)
  const repository = getRepository(request.repositoryId, request.repositoryTitle)
  const isPending = normalizeStatus(request.status) === "pending"

  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <AvatarInitials user={requester} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold tracking-tight">{requester.name}</h2>
            <Badge className="rounded-lg" variant="secondary">
              {toTitleCase(requester.role)}
            </Badge>
            {requester.trustLabel ? (
              <TrustBadge level={requester.trustLabel}>
                {toTitleCase(requester.trustLabel)}
              </TrustBadge>
            ) : null}
            <StatusBadge status={request.status} />
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Requested access to{" "}
            <Link
              className="font-medium text-foreground transition hover:text-primary"
              to={`/app/repositories/${repository.id}`}
            >
              {repository.title}
            </Link>
          </p>
          <p className="mt-3 rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-sm leading-6 text-muted-foreground dark:border-primary/20 dark:bg-primary/5">
            {request.reason}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Requested {formatDate(request.createdAt)}</span>
            <VisibilityBadge visibility={repository.visibility} />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          {isPending ? (
            <>
              <Button
                onClick={() => onUpdateStatus(request.id, "approved")}
                size="sm"
                type="button"
              >
                <CheckCircle2 className="size-4" />
                Approve
              </Button>
              <Button
                onClick={() => onUpdateStatus(request.id, "denied")}
                size="sm"
                type="button"
                variant="outline"
              >
                <XCircle className="size-4" />
                Deny
              </Button>
            </>
          ) : null}
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/repositories/${repository.id}`}>
              View Repository
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <RequestMoreMenu />
        </div>
      </div>
    </article>
  )
}

function SentRequestCard({ request }) {
  const repository = getRepository(request.repositoryId, request.repositoryTitle)
  const owner = getUser(request.ownerId, request.ownerName)
  const isPending = normalizeStatus(request.status) === "pending"

  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/80 bg-[#FCF7FF] text-primary shadow-sm dark:border-primary/20 dark:bg-primary/5">
          <Send className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="font-semibold tracking-tight transition hover:text-primary"
              to={`/app/repositories/${repository.id}`}
            >
              {repository.title}
            </Link>
            <VisibilityBadge visibility={repository.visibility} />
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Owner: <span className="font-medium text-foreground">{owner.name}</span>
          </p>
          <p className="mt-3 rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-sm leading-6 text-muted-foreground dark:border-primary/20 dark:bg-primary/5">
            {request.reason}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Requested {formatDate(request.createdAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/repositories/${repository.id}`}>
              View Repository
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          {isPending ? (
            <Button
              onClick={() => toast("Access request cancellation will be connected later.")}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel Request
            </Button>
          ) : null}
          <RequestMoreMenu />
        </div>
      </div>
    </article>
  )
}

function AccessRequestsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [requests, setRequests] = useState(mockAccessRequests)

  const currentRequests = useMemo(() => {
    const scopedRequests = requests.filter((request) =>
      filters.scope === "received"
        ? request.ownerId === currentUserId
        : request.requesterId === currentUserId
    )
    const statusFiltered = scopedRequests.filter((request) => {
      return (
        filters.status === "all" ||
        normalizeStatus(request.status) === filters.status
      )
    })

    return sortRequests(statusFiltered, filters.sort)
  }, [filters, requests])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function clearFilters() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      status: "all",
    }))
  }

  function updateRequestStatus(requestId, status) {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    )

    toast(status === "approved" ? "Access request approved." : "Access request denied.")
  }

  const isReceived = filters.scope === "received"

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <Button
            onClick={() => toast("Access request creation will be connected later.")}
            type="button"
          >
            <Plus className="size-4" />
            Request Access
          </Button>
        }
        description="Review and manage requests to access restricted or private repositories."
        title="Access Requests"
      />

      <section className="space-y-3">
        <div className="overflow-x-auto pb-1">
          <Tabs
            onValueChange={(value) => updateFilter("scope", value)}
            value={filters.scope}
          >
            <TabsList className="min-w-max border border-[#E9C8F2]/70 bg-[#FCF7FF] dark:border-primary/20 dark:bg-primary/5">
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {currentRequests.length} {isReceived ? "received" : "sent"} access requests.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              onValueChange={(value) => updateFilter("status", value)}
              value={filters.status}
            >
              <SelectTrigger className="w-full border-border bg-background/80 sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                <SelectItem value="repository">Repository</SelectItem>
                <SelectItem value="requester">Requester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {currentRequests.length > 0 ? (
        <div className="space-y-3">
          {currentRequests.map((request) =>
            isReceived ? (
              <ReceivedRequestCard
                key={request.id}
                onUpdateStatus={updateRequestStatus}
                request={request}
              />
            ) : (
              <SentRequestCard key={request.id} request={request} />
            )
          )}
        </div>
      ) : (
        <EmptyState
          action={
            <Button onClick={clearFilters} type="button">
              Clear filters
            </Button>
          }
          description={
            isReceived
              ? "Access requests from other users will appear here."
              : "Repositories you requested access to will appear here."
          }
          icon={FileQuestion}
          title={isReceived ? "No received requests" : "No sent requests"}
        />
      )}
    </PageShell>
  )
}

export default AccessRequestsPage
