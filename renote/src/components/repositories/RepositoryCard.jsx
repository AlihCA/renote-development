import { Link } from "react-router"
import {
  ArrowUpRight,
  Eye,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Share2,
  Sparkles,
  Trash2,
  Archive,
} from "lucide-react"
import { toast } from "sonner"

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
import { cn } from "@/lib/utils"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value)
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RepositoryMetric({ icon: Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/75" />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  )
}

function handleMenuAction(label) {
  toast(`${label} is a prototype action.`)
}

function RepositoryCard({ repository, view = "grid" }) {
  const isList = view === "list"

  return (
    <article
      className={cn(
        "renote-card flex h-full flex-col gap-4 p-5 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5",
        isList && "md:flex-row md:items-start md:justify-between"
      )}
    >
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Link
              className="text-lg font-semibold tracking-tight transition hover:text-primary"
              to={`/app/workspace/${repository.id}`}
            >
              {repository.title}
            </Link>
            <div className="flex flex-wrap gap-2">
              <VisibilityBadge visibility={repository.visibility} />
              <TrustBadge level={repository.trustLabel}>
                {toLabel(repository.trustLabel)}
              </TrustBadge>
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

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {repository.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {repository.tags.slice(0, 4).map((tag) => (
            <Badge className="rounded-xl" key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <RepositoryMetric
            icon={FileText}
            label="files"
            value={repository.fileCount}
          />
          <RepositoryMetric
            icon={FolderOpen}
            label="folders"
            value={repository.folderCount}
          />
          <RepositoryMetric
            icon={Sparkles}
            label="summaries"
            value={repository.summaryCount}
          />
          <RepositoryMetric
            icon={Eye}
            label="views"
            value={formatNumber(repository.views)}
          />
        </div>
      </div>

      <div
        className={cn(
          "mt-auto flex flex-col gap-3 border-t pt-4",
          isList && "md:mt-0 md:w-48 md:border-l md:border-t-0 md:pl-4 md:pt-0"
        )}
      >
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
    </article>
  )
}

export default RepositoryCard
