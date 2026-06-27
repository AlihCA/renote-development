import { useState } from "react"
import { Link } from "react-router"
import {
  Eye,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import StatusBadge from "@/components/common/StatusBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import NewFolderDialog from "@/components/workspace/NewFolderDialog"
import UploadFileDialog from "@/components/workspace/UploadFileDialog"
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar"
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

const MAX_FOLDER_DEPTH = 5

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

function getFolderFileCount(files, folderId) {
  return files.filter((file) => file.folderId === folderId).length
}

function FolderStrip({ files, folders, onSelectFolder, selectedFolderId }) {
  const folderOptions = [
    {
      count: files.length,
      depth: 0,
      id: "all",
      name: "All Files",
      type: "all",
    },
    ...folders.map((folder) => ({
      ...folder,
      count: getFolderFileCount(files, folder.id),
      type: "folder",
    })),
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {folderOptions.map((folder) => {
        const isActive = selectedFolderId === folder.id
        const Icon =
          folder.type === "all" ? FileText : isActive ? FolderOpen : Folder

        return (
          <button
            className={cn(
              "group flex min-w-0 items-center gap-3 rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-3 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5",
              isActive && "border-primary/45 bg-primary/10 text-primary shadow-none"
            )}
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            type="button"
          >
            <span
              className={cn(
                "inline-grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-muted text-muted-foreground transition",
                isActive && "border-primary/20 bg-primary text-primary-foreground"
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 text-sm font-semibold">
                {"- ".repeat(folder.depth)}
                {folder.name}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {folder.count} item{folder.count === 1 ? "" : "s"}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
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
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-3 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
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
        <div className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_7rem] gap-3 border-b border-[#E9C8F2]/70 bg-[#FCF7FF] px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground dark:border-border dark:bg-primary/5">
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
              className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_7rem] items-center gap-3 border-b border-[#E9C8F2]/50 px-4 py-3 transition-colors last:border-b-0 hover:bg-[#FFF8FE] dark:border-border/50 dark:hover:bg-primary/5"
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
  allFiles,
  files,
  folders,
  onCreateFolder,
  onOpenAi,
  onSelectFolder,
  onUploadFile,
  query,
  selectedFolderDepth = 0,
  selectedFolderId = "all",
  selectedFolderName,
  setQuery,
  setSortBy,
  setViewMode,
  sortBy,
  viewMode = "list",
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const repositoryFiles = allFiles ?? files
  const defaultFolderId = selectedFolderId === "all" ? "none" : selectedFolderId
  const defaultParentId = selectedFolderId === "all" ? "root" : selectedFolderId
  const canCreateFolder =
    selectedFolderId === "all" || selectedFolderDepth < MAX_FOLDER_DEPTH - 1
  const folderCount = folders.length

  return (
    <section className="renote-card min-w-0 overflow-hidden">
      <div className="space-y-4 border-b border-[#E9C8F2]/70 p-4 dark:border-border/70">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold tracking-tight">
              {selectedFolderName ?? "Files"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {folderCount} folder{folderCount === 1 ? "" : "s"}{" \u00b7 "}
              {files.length} file{files.length === 1 ? "" : "s"} shown
            </p>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" type="button">
                  <Plus className="size-4" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel>
                  Add to {selectedFolderName ?? "All Files"}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    setIsUploadOpen(true)
                  }}
                >
                  <Upload className="size-4" />
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!canCreateFolder}
                  onSelect={(event) => {
                    event.preventDefault()
                    setIsNewFolderOpen(true)
                  }}
                >
                  <FolderPlus className="size-4" />
                  New Folder
                </DropdownMenuItem>
                {!canCreateFolder ? (
                  <DropdownMenuLabel className="py-1.5 text-[11px] leading-4">
                    Maximum folder depth has been reached.
                  </DropdownMenuLabel>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            <UploadFileDialog
              defaultFolderId={defaultFolderId}
              folders={folders}
              onOpenChange={setIsUploadOpen}
              onUploadFile={onUploadFile}
              open={isUploadOpen}
            />
            <NewFolderDialog
              defaultParentId={defaultParentId}
              folders={folders}
              onCreateFolder={onCreateFolder}
              onOpenChange={setIsNewFolderOpen}
              open={isNewFolderOpen}
              showDefaultTrigger={false}
            />
          </div>
        </div>

        <WorkspaceToolbar
          onOpenAi={onOpenAi}
          query={query}
          setQuery={setQuery}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />

        <FolderStrip
          files={repositoryFiles}
          folders={folders}
          onSelectFolder={onSelectFolder}
          selectedFolderId={selectedFolderId}
        />
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
