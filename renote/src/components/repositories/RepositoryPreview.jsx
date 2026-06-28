import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  Activity as ActivityIcon,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
  CalendarClock,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Info,
  KeyRound,
  LayoutGrid,
  List,
  LockKeyhole,
  Quote,
  Search,
  Share2,
  Sparkles,
  Star,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import StatusBadge from "@/components/common/StatusBadge"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockFiles, mockFolders, mockSummaries } from "@/data"
import { cn, formatCount } from "@/lib/utils"

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

function sortByDepthAndName(folders) {
  return [...folders].sort((first, second) => {
    if (first.depth !== second.depth) {
      return first.depth - second.depth
    }

    return first.name.localeCompare(second.name)
  })
}

function RepositoryPreviewActions({
  canRequestAccess,
  isPublic,
  onShowDetails,
  repository,
}) {
  if (isPublic) {
    return (
      <div className="flex flex-wrap gap-2 xl:justify-end">
        <Button asChild size="sm" variant="outline">
          <Link to="/sign-in">
            <Star className="size-4" />
            Sign in to save
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/sign-in">
            <Sparkles className="size-4" />
            Sign in to use AI Summary
          </Link>
        </Button>
        {canRequestAccess ? (
          <Button asChild size="sm" variant="outline">
            <Link to="/sign-in">
              <KeyRound className="size-4" />
              Sign in to request access
            </Link>
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 xl:justify-end">
      <Button asChild size="sm">
        <Link to={`/app/workspace/${repository.id}`}>
          Open Workspace
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
      <Button
        onClick={() =>
          toast("Saved to collection prototype action will be connected later.")
        }
        size="sm"
        type="button"
        variant="outline"
      >
        <Star className="size-4" />
        Save to Collection
      </Button>
      {canRequestAccess ? (
        <Button
          onClick={() => toast("Access request will be connected later.")}
          size="sm"
          type="button"
          variant="outline"
        >
          <KeyRound className="size-4" />
          Request Access
        </Button>
      ) : null}
      <Button
        onClick={() => toast("Share options will be connected later.")}
        size="sm"
        type="button"
        variant="outline"
      >
        <Share2 className="size-4" />
        Share
      </Button>
      <Button onClick={onShowDetails} size="sm" type="button" variant="outline">
        <Info className="size-4" />
        Details
      </Button>
    </div>
  )
}

function RepositoryPreviewHeader({
  backHref,
  backLabel,
  isPublic,
  onShowDetails,
  repository,
}) {
  const canRequestAccess = ["private", "restricted"].includes(repository.visibility)

  return (
    <>
      <Button asChild className="w-fit" size="sm" variant="ghost">
        <Link to={backHref}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </Button>

      <section className="renote-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <nav
              aria-label="Repository preview breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <Link className="transition hover:text-primary" to={backHref}>
                Explore
              </Link>
              <span>/</span>
              <span className="truncate text-foreground/75">{repository.title}</span>
            </nav>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
                  {repository.title}
                </h1>
                <TrustBadge level={repository.trustLabel}>
                  {toLabel(repository.trustLabel)}
                </TrustBadge>
                <VisibilityBadge visibility={repository.visibility} />
              </div>
              <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                {repository.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(repository.tags ?? []).map((tag) => (
                <Badge className="rounded-xl" key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground">
                Updated {formatDate(repository.updatedAt)}
              </span>
            </div>
          </div>

          <RepositoryPreviewActions
            canRequestAccess={canRequestAccess}
            isPublic={isPublic}
            onShowDetails={onShowDetails}
            repository={repository}
          />
        </div>
      </section>
    </>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function RepositoryPreviewSummaryLock() {
  return (
    <section className="renote-card space-y-4 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <LockKeyhole className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">AI Summary</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sign in to generate AI summaries and save review notes for this
            repository.
          </p>
        </div>
      </div>
      <Button asChild className="w-full sm:w-fit" variant="outline">
        <Link to="/sign-in">
          <Sparkles className="size-4" />
          Sign in to use AI Summary
        </Link>
      </Button>
    </section>
  )
}

function RepositoryOverviewPanel({
  files,
  folders,
  isPublic,
  onViewContents,
  repository,
  summaries,
}) {
  const stats = [
    {
      icon: FileText,
      label: "Files",
      value: files.length || repository.fileCount,
    },
    {
      icon: FolderOpen,
      label: "Folders",
      value: folders.length || repository.folderCount,
    },
    {
      icon: Sparkles,
      label: "Summaries",
      value: summaries.length || repository.summaryCount,
    },
    {
      icon: Eye,
      label: "Views",
      value: formatCount(repository.views),
    },
    {
      icon: Quote,
      label: "Citations",
      value: formatCount(repository.citationCount),
    },
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
      <section className="renote-card space-y-5 p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Repository Overview
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard
              icon={stat.icon}
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-tight">Learning scope</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {(repository.learningObjectives ?? []).map((objective) => (
              <div
                className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground"
                key={objective}
              >
                {objective}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-start sm:justify-end">
          <Button onClick={onViewContents} type="button">
            <FolderOpen className="size-4" />
            View Contents
          </Button>
        </div>
      </section>

      <div className="space-y-4">
        {isPublic ? <RepositoryPreviewSummaryLock /> : null}

        <section className="renote-card space-y-4 p-5">
          <div>
            <h2 className="font-semibold tracking-tight">Repository Details</h2>
            <p className="text-sm text-muted-foreground">
              Key academic metadata for this preview.
            </p>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="text-right font-medium">{repository.ownerName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="text-right font-medium">{repository.subject}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Visibility</dt>
              <dd className="text-right font-medium">
                {toLabel(repository.visibility)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="text-right font-medium">
                {formatDate(repository.updatedAt)}
              </dd>
            </div>
          </dl>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Topics</p>
            <div className="flex flex-wrap gap-2">
              {(repository.includedTopics ?? repository.tags ?? []).map((topic) => (
                <Badge
                  className="rounded-xl border-[#E9C8F2]/80 bg-white/80 text-muted-foreground dark:border-primary/20 dark:bg-background/40"
                  key={topic}
                  variant="outline"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
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

function PreviewAction({ file, isPublic }) {
  if (isPublic) {
    return (
      <Button
        aria-label={`Preview ${file.name}`}
        onClick={() => toast("Public file preview will be connected later.")}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Eye className="size-4" />
      </Button>
    )
  }

  return (
    <Button asChild size="icon-sm" variant="ghost">
      <Link aria-label={`Preview ${file.name}`} to={`/app/files/${file.id}`}>
        <Eye className="size-4" />
      </Link>
    </Button>
  )
}

function FileCard({ file, isPublic }) {
  const fileType = getFileType(file)

  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-3 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex items-start gap-3">
        <FileTypeIcon extension={file.extension} size="sm" type={file.type} />
        <div className="min-w-0 flex-1">
          {isPublic ? (
            <h3 className="line-clamp-1 text-sm font-semibold">{file.name}</h3>
          ) : (
            <Link
              className="line-clamp-1 text-sm font-semibold transition hover:text-primary"
              to={`/app/files/${file.id}`}
            >
              {file.name}
            </Link>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {toLabel(fileType)} / {file.size} /{" "}
            {formatDate(file.updatedAt ?? file.uploadedAt)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <SummaryStatus file={file} />
        <PreviewAction file={file} isPublic={isPublic} />
      </div>
    </article>
  )
}

function FileTable({ files, isPublic }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_6rem] gap-3 border-b border-[#E9C8F2]/70 bg-[#FCF7FF] px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground dark:border-border dark:bg-primary/5">
          <span>Name</span>
          <span>Type</span>
          <span>Updated</span>
          <span>Size</span>
          <span>Summary</span>
          <span className="text-right">Preview</span>
        </div>

        {files.map((file) => {
          const fileType = getFileType(file)

          return (
            <article
              className="grid grid-cols-[minmax(0,1.65fr)_7rem_8rem_7rem_7rem_6rem] items-center gap-3 border-b border-[#E9C8F2]/50 px-4 py-3 transition-colors last:border-b-0 hover:bg-[#FFF8FE] dark:border-border/50 dark:hover:bg-primary/5"
              key={file.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileTypeIcon
                  extension={file.extension}
                  size="sm"
                  type={file.type}
                />
                <div className="min-w-0">
                  {isPublic ? (
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {file.name}
                    </h3>
                  ) : (
                    <Link
                      className="line-clamp-1 text-sm font-semibold transition hover:text-primary"
                      to={`/app/files/${file.id}`}
                    >
                      {file.name}
                    </Link>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Read-only repository preview
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
              <div className="flex justify-end">
                <PreviewAction file={file} isPublic={isPublic} />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function RepositoryPreviewToolbar({
  isPublic,
  query,
  setQuery,
  setSortBy,
  setViewMode,
  sortBy,
  viewMode,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="renote-input-shell h-10 w-full lg:max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search files"
          type="search"
          value={query}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-full border-border bg-background/90 sm:w-44">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        <div className="inline-flex w-fit rounded-2xl border border-border bg-background/80 p-1">
          <Button
            aria-label="List view"
            className={cn(viewMode === "list" && "bg-muted text-foreground")}
            onClick={() => setViewMode("list")}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            aria-label="Grid view"
            className={cn(viewMode === "grid" && "bg-muted text-foreground")}
            onClick={() => setViewMode("grid")}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
        </div>

        {isPublic ? (
          <Button asChild size="sm" variant="outline">
            <Link to="/sign-in">
              <Sparkles className="size-4" />
              AI Summary
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function RepositoryPreviewFiles({
  displayedFiles,
  files,
  folders,
  isPublic,
  onSelectFolder,
  query,
  selectedFolderId,
  selectedFolderName,
  setQuery,
  setSortBy,
  setViewMode,
  sortBy,
  viewMode,
}) {
  return (
    <section className="renote-card min-w-0 overflow-hidden">
      <div className="space-y-4 border-b border-[#E9C8F2]/70 p-4 dark:border-border/70">
        <div>
          <h2 className="font-semibold tracking-tight">{selectedFolderName}</h2>
          <p className="text-sm text-muted-foreground">
            {folders.length} folder{folders.length === 1 ? "" : "s"} /{" "}
            {displayedFiles.length} file
            {displayedFiles.length === 1 ? "" : "s"} shown
          </p>
        </div>

        <RepositoryPreviewToolbar
          isPublic={isPublic}
          query={query}
          setQuery={setQuery}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />

        <FolderStrip
          files={files}
          folders={folders}
          onSelectFolder={onSelectFolder}
          selectedFolderId={selectedFolderId}
        />
      </div>

      {displayedFiles.length > 0 ? (
        viewMode === "list" ? (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {displayedFiles.map((file) => (
                <FileCard file={file} isPublic={isPublic} key={file.id} />
              ))}
            </div>
            <FileTable files={displayedFiles} isPublic={isPublic} />
          </>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {displayedFiles.map((file) => (
              <FileCard file={file} isPublic={isPublic} key={file.id} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          className="min-h-72"
          description="Try another folder or search term."
          icon={FileText}
          title="No files found"
        />
      )}
    </section>
  )
}

function SummaryRow({ isPublic, summary }) {
  const content = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold">{summary.title}</h3>
          <Badge className="rounded-xl" variant="secondary">
            {summary.mode}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{summary.fileName}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {summary.preview}
        </p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDate(summary.generatedAt)}
      </span>
    </div>
  )
  const className =
    "block p-4 transition-colors hover:bg-[#FFF8FE] dark:hover:bg-primary/5"

  return isPublic ? (
    <article className={className}>{content}</article>
  ) : (
    <Link className={className} to={`/app/summaries/${summary.id}`}>
      {content}
    </Link>
  )
}

function RepositorySummariesPanel({ isPublic, summaries }) {
  const sortedSummaries = useMemo(
    () =>
      [...summaries].sort(
        (first, second) =>
          new Date(second.generatedAt) - new Date(first.generatedAt)
      ),
    [summaries]
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="renote-card overflow-hidden">
        <div className="border-b border-[#E9C8F2]/70 p-5 dark:border-border/70">
          <h2 className="font-semibold tracking-tight">Summaries</h2>
          <p className="text-sm text-muted-foreground">
            Read-only summary previews linked to this repository.
          </p>
        </div>

        {sortedSummaries.length > 0 ? (
          <div className="divide-y divide-[#E9C8F2]/60 dark:divide-border/60">
            {sortedSummaries.map((summary) => (
              <SummaryRow
                isPublic={isPublic}
                key={summary.id}
                summary={summary}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="min-h-72"
            description="AI summaries for this repository will appear here."
            icon={Sparkles}
            title="No summaries yet"
          />
        )}
      </section>

      {isPublic ? (
        <RepositoryPreviewSummaryLock />
      ) : (
        <section className="renote-card h-fit space-y-3 p-5">
          <span className="grid size-10 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight">AI Summary</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Open the workspace to generate new summaries or save review notes.
            </p>
          </div>
          <Button asChild className="w-full" variant="outline">
            <Link to="/app/summaries">View Summary History</Link>
          </Button>
        </section>
      )}
    </div>
  )
}

function RepositoryActivityPanel({ files, folders, repository, summaries }) {
  const latestFile = [...files].sort(
    (first, second) =>
      new Date(second.updatedAt ?? second.uploadedAt) -
      new Date(first.updatedAt ?? first.uploadedAt)
  )[0]
  const latestFolder = [...folders].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt)
  )[0]
  const latestSummary = [...summaries].sort(
    (first, second) =>
      new Date(second.generatedAt) - new Date(first.generatedAt)
  )[0]
  const activityItems = [
    {
      detail: latestFile
        ? `Added ${latestFile.name} to the repository.`
        : "Added a prototype academic file.",
      icon: FileText,
      title: "Uploaded a file",
      when: latestFile?.updatedAt ?? repository.updatedAt,
    },
    {
      detail: latestFolder
        ? `Created ${latestFolder.name} for organized review materials.`
        : "Created a folder for review materials.",
      icon: FolderOpen,
      title: "Created a folder",
      when: latestFolder?.createdAt ?? repository.createdAt,
    },
    {
      detail: latestSummary
        ? `Generated ${latestSummary.title}.`
        : "Generated a prototype repository summary.",
      icon: Sparkles,
      title: "Generated a summary",
      when: latestSummary?.generatedAt ?? repository.updatedAt,
    },
    {
      detail: "Adjusted repository description, topics, and academic scope.",
      icon: CalendarClock,
      title: "Updated repository details",
      when: repository.updatedAt,
    },
    {
      detail: `Visibility is currently set to ${toLabel(repository.visibility)}.`,
      icon: ActivityIcon,
      title: "Updated visibility",
      when: repository.updatedAt,
    },
  ]

  return (
    <section className="renote-card overflow-hidden">
      <div className="border-b border-[#E9C8F2]/70 p-5 dark:border-border/70">
        <h2 className="font-semibold tracking-tight">Activity</h2>
        <p className="text-sm text-muted-foreground">
          Recent read-only activity for this repository preview.
        </p>
      </div>

      <div className="divide-y divide-[#E9C8F2]/60 dark:divide-border/60">
        {activityItems.map((item) => {
          const Icon = item.icon

          return (
            <article
              className="flex gap-3 p-4 transition-colors hover:bg-[#FFF8FE] dark:hover:bg-primary/5"
              key={`${item.title}-${item.detail}`}
            >
              <span className="inline-grid size-10 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] text-primary dark:border-primary/20 dark:bg-primary/5">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.when)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function getFolderName(selectedFolderId, folders) {
  if (selectedFolderId === "all") {
    return "All Files"
  }

  return folders.find((folder) => folder.id === selectedFolderId)?.name ?? "Files"
}

function RepositoryPreview({
  backHref,
  backLabel,
  mode = "signed-in",
  repository,
}) {
  const isPublic = mode === "public"
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFolderId, setSelectedFolderId] = useState("all")
  const [fileQuery, setFileQuery] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [viewMode, setViewMode] = useState("list")

  const folders = useMemo(
    () =>
      sortByDepthAndName(
        mockFolders.filter((folder) => folder.repositoryId === repository.id)
      ),
    [repository.id]
  )
  const files = useMemo(
    () => mockFiles.filter((file) => file.repositoryId === repository.id),
    [repository.id]
  )
  const summaries = useMemo(
    () => mockSummaries.filter((summary) => summary.repositoryId === repository.id),
    [repository.id]
  )
  const visibleFiles = useMemo(
    () =>
      selectedFolderId === "all"
        ? files
        : files.filter((file) => file.folderId === selectedFolderId),
    [files, selectedFolderId]
  )
  const displayedFiles = useMemo(() => {
    const normalizedQuery = fileQuery.trim().toLowerCase()
    const searchedFiles = normalizedQuery
      ? visibleFiles.filter((file) =>
          [file.name, file.extension, file.type, file.size]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(normalizedQuery))
        )
      : visibleFiles

    return [...searchedFiles].sort((first, second) => {
      if (sortBy === "name") {
        return first.name.localeCompare(second.name)
      }

      if (sortBy === "type") {
        return getFileType(first).localeCompare(getFileType(second))
      }

      return (
        new Date(second.updatedAt ?? second.uploadedAt) -
        new Date(first.updatedAt ?? first.uploadedAt)
      )
    })
  }, [fileQuery, sortBy, visibleFiles])

  return (
    <>
      <RepositoryPreviewHeader
        backHref={backHref}
        backLabel={backLabel}
        isPublic={isPublic}
        onShowDetails={() => setActiveTab("overview")}
        repository={repository}
      />

      <WorkspaceTabs onValueChange={setActiveTab} value={activeTab} />

      {activeTab === "overview" ? (
        <RepositoryOverviewPanel
          files={files}
          folders={folders}
          isPublic={isPublic}
          onViewContents={() => setActiveTab("files")}
          repository={repository}
          summaries={summaries}
        />
      ) : null}

      {activeTab === "files" ? (
        <RepositoryPreviewFiles
          displayedFiles={displayedFiles}
          files={files}
          folders={folders}
          isPublic={isPublic}
          onSelectFolder={setSelectedFolderId}
          query={fileQuery}
          selectedFolderId={selectedFolderId}
          selectedFolderName={getFolderName(selectedFolderId, folders)}
          setQuery={setFileQuery}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      ) : null}

      {activeTab === "summaries" ? (
        <RepositorySummariesPanel isPublic={isPublic} summaries={summaries} />
      ) : null}

      {activeTab === "activity" ? (
        <RepositoryActivityPanel
          files={files}
          folders={folders}
          repository={repository}
          summaries={summaries}
        />
      ) : null}
    </>
  )
}

export default RepositoryPreview
