import { Link } from "react-router"
import {
  ArrowUpRight,
  CalendarClock,
  FileText,
  FolderOpen,
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

function toLabel(value) {
  return String(value ?? "file")
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RecentMetric({ icon: Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/75" />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  )
}

function RecentRepositoryRow({ repository }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="min-w-0 text-base font-semibold tracking-tight transition hover:text-primary"
              to={`/app/workspace/${repository.id}`}
            >
              {repository.title}
            </Link>
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>

          <div className="flex flex-wrap gap-2">
            {repository.tags.slice(0, 3).map((tag) => (
              <Badge className="rounded-xl" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <RecentMetric
              icon={FileText}
              label="files"
              value={repository.fileCount}
            />
            <RecentMetric
              icon={FolderOpen}
              label="folders"
              value={repository.folderCount}
            />
            <RecentMetric
              icon={Sparkles}
              label="summaries"
              value={repository.summaryCount}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <span className="text-xs text-muted-foreground">
            Updated {formatDate(repository.updatedAt)}
          </span>
          <Button asChild size="xs" variant="outline">
            <Link to={`/app/workspace/${repository.id}`}>
              Open workspace
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

function RecentFileCompactRow({ file, repositoryTitle }) {
  const fileType = file.extension ?? file.type ?? "file"

  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <FileTypeIcon extension={file.extension} size="default" type={file.type} />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="min-w-0 font-semibold tracking-tight transition hover:text-primary"
              to={`/app/files/${file.id}`}
            >
              {file.name}
            </Link>
            {file.summaryAvailable ? (
              <Badge className="gap-1 rounded-xl border-primary/15 bg-primary/10 text-primary shadow-none">
                <Sparkles className="size-3" />
                Summary ready
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{toLabel(fileType)}</span>
            <span>{repositoryTitle}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <span className="text-xs text-muted-foreground">
            Updated {formatDate(file.updatedAt ?? file.uploadedAt)}
          </span>
          <Button asChild size="xs" variant="outline">
            <Link to={`/app/files/${file.id}`}>
              Preview
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

function RecentSummaryRow({ summary }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="min-w-0 font-semibold tracking-tight transition hover:text-primary"
              to={`/app/summaries/${summary.id}`}
            >
              {summary.title}
            </Link>
            <Badge className="rounded-xl" variant="outline">
              {summary.mode}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{summary.fileName}</p>
          <p className="line-clamp-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            {summary.preview}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5 text-primary/75" />
            {formatDate(summary.generatedAt)}
          </span>
          <Button asChild size="xs" variant="outline">
            <Link to={`/app/summaries/${summary.id}`}>
              View summary
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export { RecentFileCompactRow, RecentRepositoryRow, RecentSummaryRow }
