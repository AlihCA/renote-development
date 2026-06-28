import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import {
  Activity as ActivityIcon,
  ArrowLeft,
  CalendarClock,
  Eye,
  FileText,
  FolderOpen,
  Library,
  Quote,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import RepositoryMetricsRow from "@/components/repositories/RepositoryMetricsRow"
import AISummaryDrawer from "@/components/workspace/AISummaryDrawer"
import RepositoryDetailsDrawer from "@/components/workspace/RepositoryDetailsDrawer"
import RepositoryFileList from "@/components/workspace/RepositoryFileList"
import RepositoryHeader from "@/components/workspace/RepositoryHeader"
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  mockFiles,
  mockFolders,
  mockRepositories,
  mockSummaries,
} from "@/data"

function sortByDepthAndName(folders) {
  return [...folders].sort((first, second) => {
    if (first.depth !== second.depth) {
      return first.depth - second.depth
    }

    return first.name.localeCompare(second.name)
  })
}

function createSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getFolderName(selectedFolderId, folders) {
  if (selectedFolderId === "all") {
    return "All Files"
  }

  return folders.find((folder) => folder.id === selectedFolderId)?.name ?? "Files"
}

function getFileType(file) {
  return file.extension ?? file.type ?? "file"
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatCompactCount(value) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: Number(value) >= 1000 ? "compact" : "standard",
  }).format(value ?? 0)
}

function toTitleCase(value) {
  return String(value ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function WorkspaceOverviewPanel({ files, folders, repository, summaries }) {
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
      icon: Quote,
      label: "Citations",
      value: repository.citationCount ?? 0,
    },
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
      <section className="renote-card space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <TrustBadge level={repository.trustLabel}>
              {toTitleCase(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Repository Overview
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>
          <RepositoryMetricsRow repository={repository} showCategory={false} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5"
                key={stat.label}
              >
                <Icon className="size-4 text-primary" />
                <p className="mt-3 text-xl font-semibold">
                  {formatCompactCount(stat.value)}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
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
      </section>

      <section className="renote-card space-y-4 p-5">
        <div>
          <h2 className="font-semibold tracking-tight">Repository Details</h2>
          <p className="text-sm text-muted-foreground">
            Key academic metadata for this workspace.
          </p>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Subject</dt>
            <dd className="font-medium">{repository.subject}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Views</dt>
            <dd className="font-medium">{formatCompactCount(repository.views)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="font-medium">{formatDate(repository.updatedAt)}</dd>
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
  )
}

function WorkspaceSummariesPanel({ summaries }) {
  const sortedSummaries = useMemo(
    () =>
      [...summaries].sort(
        (first, second) =>
          new Date(second.generatedAt) - new Date(first.generatedAt)
      ),
    [summaries]
  )

  if (sortedSummaries.length === 0) {
    return (
      <EmptyState
        className="renote-card min-h-72"
        description="Generate a summary from the AI Summary drawer to preview it here."
        icon={Sparkles}
        title="No summaries yet"
      />
    )
  }

  return (
    <section className="renote-card overflow-hidden">
      <div className="border-b border-[#E9C8F2]/70 p-5 dark:border-border/70">
        <h2 className="font-semibold tracking-tight">Summaries</h2>
        <p className="text-sm text-muted-foreground">
          Recent generated summaries for this repository.
        </p>
      </div>

      <div className="divide-y divide-[#E9C8F2]/60 dark:divide-border/60">
        {sortedSummaries.map((summary) => (
          <Link
            className="block p-4 transition-colors hover:bg-[#FFF8FE] dark:hover:bg-primary/5"
            key={summary.id}
            to={`/app/summaries/${summary.id}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold">
                    {summary.title}
                  </h3>
                  <Badge className="rounded-xl" variant="secondary">
                    {summary.mode}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {summary.fileName}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {summary.preview}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(summary.generatedAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function WorkspaceActivityPanel({ files, folders, repository, summaries }) {
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
        ? `Added ${latestFile.name} to the workspace.`
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
      detail: `Visibility is currently set to ${toTitleCase(
        repository.visibility
      )}.`,
      icon: Eye,
      title: "Changed visibility",
      when: repository.updatedAt,
    },
    {
      detail: "Approved a prototype access request for a classmate reviewer.",
      icon: ActivityIcon,
      title: "Approved access request",
      when: repository.updatedAt,
    },
  ]

  return (
    <section className="renote-card overflow-hidden">
      <div className="border-b border-[#E9C8F2]/70 p-5 dark:border-border/70">
        <h2 className="font-semibold tracking-tight">Activity</h2>
        <p className="text-sm text-muted-foreground">
          Mock workspace activity for repository collaboration.
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

function RepositoryWorkspacePage() {
  const { repositoryId } = useParams()
  const repository = mockRepositories.find((item) => item.id === repositoryId)
  const baseFolders = useMemo(
    () =>
      sortByDepthAndName(
        mockFolders.filter((folder) => folder.repositoryId === repositoryId)
      ),
    [repositoryId]
  )
  const baseFiles = useMemo(
    () => mockFiles.filter((file) => file.repositoryId === repositoryId),
    [repositoryId]
  )
  const summaries = useMemo(
    () => mockSummaries.filter((summary) => summary.repositoryId === repositoryId),
    [repositoryId]
  )
  const [folders, setFolders] = useState(baseFolders)
  const [files, setFiles] = useState(baseFiles)
  const [selectedFolderId, setSelectedFolderId] = useState("all")
  const [fileQuery, setFileQuery] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [viewMode, setViewMode] = useState("list")
  const [activeTab, setActiveTab] = useState("files")
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    setFolders(baseFolders)
    setFiles(baseFiles)
    setSelectedFolderId("all")
    setFileQuery("")
    setSortBy("updated")
    setViewMode("list")
    setActiveTab("files")
    setIsAiOpen(false)
    setIsDetailsOpen(false)
  }, [baseFiles, baseFolders])

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
  const selectedFolderName = getFolderName(selectedFolderId, folders)
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId)
  const selectedFolderDepth = selectedFolder?.depth ?? 0

  function handleCreateFolder({ name, parentId }) {
    const parentFolder = folders.find((folder) => folder.id === parentId)
    const createdAt = new Date().toISOString()
    const newFolder = {
      createdAt,
      depth: parentFolder ? parentFolder.depth + 1 : 0,
      id: `folder-${createSlug(name) || "prototype"}-${Date.now()}`,
      name,
      parentId: parentId ?? null,
      repositoryId,
    }

    setFolders((currentFolders) =>
      sortByDepthAndName([...currentFolders, newFolder])
    )
    toast("Folder created in prototype mode.")
  }

  function handleUploadFile({ extension, fileName, folderId, size }) {
    const now = new Date().toISOString()
    const normalizedExtension = extension === "url" ? undefined : extension
    const fileType = extension === "url" ? "url" : undefined

    setFiles((currentFiles) => [
      {
        extension: normalizedExtension,
        folderId,
        id: `file-${createSlug(fileName) || "prototype"}-${Date.now()}`,
        name: fileName,
        ownerName: repository?.ownerName ?? "ReNote User",
        repositoryId,
        size: size || "Prototype file",
        summaryAvailable: false,
        type: fileType,
        updatedAt: now,
        uploadedAt: now,
      },
      ...currentFiles,
    ])
    toast("File uploaded in prototype mode.")
  }

  if (!repository) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/app/my-repositories">Back to repositories</Link>
            </Button>
          }
          description="The repository route does not match any mock repository."
          icon={Library}
          title="Repository not found"
        />
      </PageShell>
    )
  }

  return (
    <PageShell className="max-w-[1500px] space-y-5 py-6 sm:py-8" size="wide">
      <Button asChild className="w-fit" size="sm" variant="ghost">
        <Link to="/app/my-repositories">
          <ArrowLeft className="size-4" />
          Back to My Repositories
        </Link>
      </Button>

      <RepositoryHeader
        onOpenDetails={() => setIsDetailsOpen(true)}
        repository={repository}
      />

      <WorkspaceTabs onValueChange={setActiveTab} value={activeTab} />

      {activeTab === "overview" ? (
        <WorkspaceOverviewPanel
          files={files}
          folders={folders}
          repository={repository}
          summaries={summaries}
        />
      ) : null}

      {activeTab === "files" ? (
        <RepositoryFileList
          allFiles={files}
          files={displayedFiles}
          folders={folders}
          onCreateFolder={handleCreateFolder}
          onOpenAi={() => setIsAiOpen(true)}
          onSelectFolder={setSelectedFolderId}
          onUploadFile={handleUploadFile}
          query={fileQuery}
          selectedFolderDepth={selectedFolderDepth}
          selectedFolderId={selectedFolderId}
          selectedFolderName={selectedFolderName}
          setQuery={setFileQuery}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      ) : null}

      {activeTab === "summaries" ? (
        <WorkspaceSummariesPanel summaries={summaries} />
      ) : null}

      {activeTab === "activity" ? (
        <WorkspaceActivityPanel
          files={files}
          folders={folders}
          repository={repository}
          summaries={summaries}
        />
      ) : null}

      <AISummaryDrawer
        folders={folders}
        isOpen={isAiOpen}
        onOpenChange={setIsAiOpen}
        selectedFolderName={selectedFolderName}
        summaries={summaries}
      />

      <RepositoryDetailsDrawer
        files={files}
        folders={folders}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        repository={repository}
        summaries={summaries}
      />
    </PageShell>
  )
}

export default RepositoryWorkspacePage
