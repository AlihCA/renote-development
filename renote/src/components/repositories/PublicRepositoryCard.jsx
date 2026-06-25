import { Link } from "react-router"
import {
  Eye,
  FileText,
  FolderOpen,
  Lock,
  Sparkles,
} from "lucide-react"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

function RepositoryStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-background/70 px-3 py-2">
      <Icon className="size-4 text-primary" />
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function PublicRepositoryCard({ fileTypes = [], repository }) {
  const isLocked = repository.visibility !== "public"
  const actionLabel = isLocked ? "Preview Details" : "View Details"

  return (
    <article className="renote-card flex h-full flex-col p-5">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <TrustBadge level={repository.trustLabel}>
                {toLabel(repository.trustLabel)}
              </TrustBadge>
              <VisibilityBadge visibility={repository.visibility} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {repository.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {repository.description}
              </p>
            </div>
          </div>

          {isLocked ? (
            <span className="renote-icon-container size-10 text-muted-foreground">
              <Lock className="size-5" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{repository.ownerName}</span>
          <span aria-hidden="true">/</span>
          <span>{toLabel(repository.ownerRole)}</span>
          <span aria-hidden="true">/</span>
          <span>{repository.subject}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {repository.tags.slice(0, 4).map((tag) => (
            <Badge className="rounded-xl" key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <RepositoryStat
            icon={FileText}
            label="Files"
            value={repository.fileCount}
          />
          <RepositoryStat
            icon={FolderOpen}
            label="Folders"
            value={repository.folderCount}
          />
          <RepositoryStat
            icon={Sparkles}
            label="Summaries"
            value={repository.summaryCount}
          />
          <RepositoryStat
            icon={Eye}
            label="Views"
            value={formatNumber(repository.views)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex items-center gap-2">
            {fileTypes.slice(0, 4).map((fileType) => (
              <FileTypeIcon extension={fileType} key={fileType} size="sm" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(repository.updatedAt)}
          </p>
        </div>

        {isLocked ? (
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3 text-sm text-muted-foreground">
            This repository is locked for guests. Sign in to request access and
            view protected materials.
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="flex-1">
          <Link to={`/app/repositories/${repository.id}`}>{actionLabel}</Link>
        </Button>
        <Button asChild className="flex-1" variant="outline">
          <Link to="/role-selection">
            {isLocked ? "Sign in to request access" : "Sign in to summarize"}
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default PublicRepositoryCard
