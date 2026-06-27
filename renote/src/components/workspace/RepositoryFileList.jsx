import { Link } from "react-router"
import { Eye, FileText, MoreHorizontal, Sparkles, Trash2 } from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import StatusBadge from "@/components/common/StatusBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
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

function getFileType(file) {
  return file.extension ?? file.type ?? "file"
}

function FileActions({ file }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button asChild size="icon-sm" variant="ghost">
        <Link aria-label={`Preview ${file.name}`} to={`/app/files/${file.id}`}>
          <Eye className="size-4" />
        </Link>
      </Button>
      <Button
        aria-label={`Summarize ${file.name}`}
        onClick={() => toast("AI summary preview will be connected later.")}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Sparkles className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="More file actions" size="icon-sm" variant="ghost">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>File actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => toast("Rename is a prototype action.")}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Move file is a prototype action.")}>
            Move to folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => toast("Delete is a prototype action.")}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SummaryStatus({ file }) {
  return file.summaryAvailable ? (
    <StatusBadge status="success">
      <Sparkles className="size-3" />
      Ready
    </StatusBadge>
  ) : (
    <StatusBadge status="muted">Not yet</StatusBadge>
  )
}

function FileCard({ file }) {
  const fileType = getFileType(file)

  return (
    <article className="rounded-3xl border border-border/70 bg-background/80 p-3 transition hover:border-primary/20 hover:bg-[#FFF7FD] dark:hover:bg-primary/5">
      <div className="flex items-start gap-3">
        <FileTypeIcon extension={file.extension} size="sm" type={file.type} />
        <div className="min-w-0 flex-1">
          <Link
            className="line-clamp-1 text-sm font-semibold transition hover:text-primary"
            to={`/app/files/${file.id}`}
          >
            {file.name}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {toLabel(fileType)} / {file.size} /{" "}
            {formatDate(file.updatedAt ?? file.uploadedAt)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <SummaryStatus file={file} />
        <FileActions file={file} />
      </div>
    </article>
  )
}

function FileTable({ files }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_7rem] gap-3 border-b border-border/60 bg-muted/25 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Name</span>
          <span>Type</span>
          <span>Updated</span>
          <span>Size</span>
          <span>Summary</span>
          <span className="text-right">Actions</span>
        </div>

        {files.map((file) => {
          const fileType = getFileType(file)

          return (
            <article
              className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_7rem] items-center gap-3 border-b border-border/50 px-4 py-3 last:border-b-0 hover:bg-[#FFF7FD] dark:hover:bg-primary/5"
              key={file.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileTypeIcon
                  extension={file.extension}
                  size="sm"
                  type={file.type}
                />
                <div className="min-w-0">
                  <Link
                    className="line-clamp-1 text-sm font-semibold transition hover:text-primary"
                    to={`/app/files/${file.id}`}
                  >
                    {file.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Preview or summarize from row actions
                  </p>
                </div>
              </div>
              <Badge className="w-fit rounded-xl" variant="outline">
                {toLabel(fileType)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(file.updatedAt ?? file.uploadedAt)}
              </span>
              <span className="text-sm text-muted-foreground">{file.size}</span>
              <SummaryStatus file={file} />
              <FileActions file={file} />
            </article>
          )
        })}
      </div>
    </div>
  )
}

function RepositoryFileList({
  files,
  selectedFolderName,
  totalFiles,
  viewMode = "list",
}) {
  return (
    <section className="renote-card min-w-0 overflow-hidden">
      <div className="border-b border-border/70 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold tracking-tight">
              {selectedFolderName ?? "Files"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {files.length} of {totalFiles} file
              {totalFiles === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 ? (
        viewMode === "list" ? (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {files.map((file) => (
                <FileCard file={file} key={file.id} />
              ))}
            </div>
            <FileTable files={files} />
          </>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <FileCard file={file} key={file.id} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          className="min-h-72"
          description="Upload files, adjust search, or select another folder."
          icon={FileText}
          title="No files found"
        />
      )}
    </section>
  )
}

export default RepositoryFileList
