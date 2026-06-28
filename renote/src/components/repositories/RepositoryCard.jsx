import { Link } from "react-router"
import {
  ArrowUpRight,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  Archive,
} from "lucide-react"
import { toast } from "sonner"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import RepositoryMetricsRow from "@/components/repositories/RepositoryMetricsRow"
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
import { cn } from "@/lib/utils"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function handleMenuAction(label) {
  toast(`${label} is a prototype action.`)
}

function RepositoryCard({ fileTypes = [], repository, view = "grid" }) {
  const isList = view === "list"

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border border-[#E9C8F2]/80 bg-white p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:border-primary/35 dark:hover:bg-primary/5",
        isList ? "gap-0" : "gap-4"
      )}
    >
      <div className="flex flex-1 items-start gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="text-lg font-semibold tracking-tight transition hover:text-primary"
              to={`/app/workspace/${repository.id}`}
            >
              {repository.title}
            </Link>
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>

          <p className="line-clamp-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {repository.tags.slice(0, isList ? 4 : 3).map((tag) => (
              <Badge
                className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Repository insights
            </p>
            <RepositoryMetricsRow repository={repository} showCategory={false} />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Repository actions" size="icon-sm" variant="ghost">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Repository actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => handleMenuAction("Edit details")}>
              <Pencil className="size-4" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleMenuAction("Share")}>
              <Share2 className="size-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleMenuAction("Archive")}>
              <Archive className="size-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => handleMenuAction("Delete")}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[#E9C8F2]/70 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-border">
        <div className="flex min-h-8 items-center gap-2">
          {fileTypes.slice(0, 4).map((fileType) => (
            <FileTypeIcon
              className="size-7 rounded-lg shadow-none"
              extension={fileType}
              key={fileType}
              size="sm"
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(repository.updatedAt)}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/workspace/${repository.id}`}>
              Open workspace
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default RepositoryCard
