import { Link } from "react-router"
import { Clock3, FileText, FolderOpen, Sparkles } from "lucide-react"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function toLabel(value) {
  return String(value ?? "file")
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RecentRepositoryRow({ repository }) {
  return (
    <Link
      className="rounded-2xl border bg-background/75 p-3 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5"
      to={`/app/workspace/${repository.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h3 className="truncate font-semibold">{repository.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(repository.updatedAt)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileText className="size-3.5 text-primary/75" />
          {repository.fileCount} files
        </span>
        <span className="inline-flex items-center gap-1">
          <FolderOpen className="size-3.5 text-primary/75" />
          {repository.folderCount} folders
        </span>
        <span className="inline-flex items-center gap-1">
          <Sparkles className="size-3.5 text-primary/75" />
          {repository.summaryCount} summaries
        </span>
      </div>
    </Link>
  )
}

function RecentFileCompactRow({ file, repositoryTitle }) {
  const fileType = file.extension ?? file.type ?? "file"

  return (
    <Link
      className="flex items-center gap-3 rounded-2xl border bg-background/75 p-3 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5"
      to={`/app/files/${file.id}`}
    >
      <FileTypeIcon extension={file.extension} size="sm" type={file.type} />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold">{file.name}</h3>
          {file.summaryAvailable ? (
            <Sparkles className="size-3.5 shrink-0 text-primary" />
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {toLabel(fileType)} / {repositoryTitle}
        </p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDate(file.updatedAt ?? file.uploadedAt)}
      </span>
    </Link>
  )
}

function RecentSummaryRow({ summary }) {
  return (
    <Link
      className="rounded-2xl border bg-background/75 p-3 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5"
      to={`/app/summaries/${summary.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-semibold">{summary.title}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {summary.fileName}
          </p>
        </div>
        <Badge className="shrink-0 rounded-xl" variant="outline">
          {summary.mode}
        </Badge>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
        {summary.preview}
      </p>
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock3 className="size-3.5 text-primary/75" />
        {formatDate(summary.generatedAt)}
      </p>
    </Link>
  )
}

export { RecentFileCompactRow, RecentRepositoryRow, RecentSummaryRow }
