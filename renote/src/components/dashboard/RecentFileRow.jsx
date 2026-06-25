import { Link } from "react-router"
import { CheckCircle2, Sparkles } from "lucide-react"

import FileTypeIcon from "@/components/files/FileTypeIcon"
import StatusBadge from "@/components/common/StatusBadge"

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

function RecentFileRow({ file, repositoryTitle }) {
  const fileType = file.extension ?? file.type ?? "file"

  return (
    <Link
      className="flex flex-col gap-3 rounded-3xl border bg-background/75 p-4 shadow-sm transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5 sm:flex-row sm:items-center"
      to={`/app/files/${file.id}`}
    >
      <FileTypeIcon extension={file.extension} size="sm" type={file.type} />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">{file.name}</h3>
          {file.summaryAvailable ? (
            <StatusBadge status="success">
              <Sparkles className="size-3" />
              Summary ready
            </StatusBadge>
          ) : null}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {toLabel(fileType)} / {repositoryTitle}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-right">
        {file.summaryAvailable ? (
          <CheckCircle2 className="size-4 text-primary sm:hidden" />
        ) : null}
        <span>Updated {formatDate(file.updatedAt ?? file.uploadedAt)}</span>
      </div>
    </Link>
  )
}

export default RecentFileRow
