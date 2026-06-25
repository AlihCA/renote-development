import { Link } from "react-router"
import { ArrowUpRight, FileText, FolderOpen, Sparkles } from "lucide-react"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

function RepositoryMetric({ icon: Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/75" />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  )
}

function DashboardRepositoryCard({ repository }) {
  return (
    <article className="rounded-3xl border bg-background/75 p-4 shadow-sm transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Link
            className="text-base font-semibold tracking-tight transition hover:text-primary"
            to={`/app/workspace/${repository.id}`}
          >
            {repository.title}
          </Link>
          <div className="flex flex-wrap gap-2">
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Updated {formatDate(repository.updatedAt)}
        </p>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {repository.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {repository.tags.slice(0, 4).map((tag) => (
          <Badge className="rounded-xl" key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
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
        </div>

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

export default DashboardRepositoryCard
