import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import { Library } from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import AISummaryDrawer from "@/components/workspace/AISummaryDrawer"
import FolderGrid from "@/components/workspace/FolderGrid"
import RepositoryDetailsDrawer from "@/components/workspace/RepositoryDetailsDrawer"
import RepositoryFileList from "@/components/workspace/RepositoryFileList"
import RepositoryHeader from "@/components/workspace/RepositoryHeader"
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar"
import WorkspaceTabs from "@/components/workspace/WorkspaceTabs"
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
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    setFolders(baseFolders)
    setFiles(baseFiles)
    setSelectedFolderId("all")
    setFileQuery("")
    setSortBy("updated")
    setViewMode("list")
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
      <RepositoryHeader
        folders={folders}
        onCreateFolder={handleCreateFolder}
        onOpenDetails={() => setIsDetailsOpen(true)}
        onUploadFile={handleUploadFile}
        repository={repository}
      />

      <WorkspaceTabs />

      <WorkspaceToolbar
        onOpenAi={() => setIsAiOpen(true)}
        query={fileQuery}
        setQuery={setFileQuery}
        setSortBy={setSortBy}
        setViewMode={setViewMode}
        sortBy={sortBy}
        viewMode={viewMode}
      />

      <div className="renote-card p-4 sm:p-5">
        <FolderGrid
          files={files}
          folders={folders}
          onSelectFolder={setSelectedFolderId}
          selectedFolderId={selectedFolderId}
        />
      </div>

      <RepositoryFileList
        files={displayedFiles}
        selectedFolderName={selectedFolderName}
        totalFiles={visibleFiles.length}
        viewMode={viewMode}
      />

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
