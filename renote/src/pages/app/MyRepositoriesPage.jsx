import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog"
import RepositoryCard from "@/components/repositories/RepositoryCard"
import RepositoryToolbar from "@/components/repositories/RepositoryToolbar"
import { mockFiles, mockRepositories, mockUsers } from "@/data"
import { cn } from "@/lib/utils"

const currentUserId = "user-student-mia"
const initialFilters = {
  query: "",
  sort: "updated",
}

function normalize(value) {
  return String(value ?? "").toLowerCase()
}

function getSearchText(repository) {
  return [
    repository.title,
    repository.description,
    repository.category,
    repository.subject,
    repository.visibility,
    repository.trustLabel,
    repository.status,
    ...repository.tags,
  ]
    .join(" ")
    .toLowerCase()
}

function sortRepositories(repositories, sort) {
  return [...repositories].sort((first, second) => {
    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    if (sort === "views") {
      return second.views - first.views
    }

    if (sort === "saved") {
      const savedDifference = Number(second.isSaved) - Number(first.isSaved)

      if (savedDifference !== 0) {
        return savedDifference
      }

      return new Date(second.updatedAt) - new Date(first.updatedAt)
    }

    return new Date(second.updatedAt) - new Date(first.updatedAt)
  })
}

function createSlug(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function MyRepositoriesPage() {
  const currentUser =
    mockUsers.find((user) => user.id === currentUserId) ?? mockUsers[0]
  const fileTypesByRepository = useMemo(() => {
    const lookup = new Map()

    mockFiles.forEach((file) => {
      const fileType = file.extension ?? file.type

      if (!fileType) {
        return
      }

      const currentTypes = lookup.get(file.repositoryId) ?? []

      if (!currentTypes.includes(fileType)) {
        lookup.set(file.repositoryId, [...currentTypes, fileType])
      }
    })

    return lookup
  }, [])
  const initialRepositories = useMemo(
    () =>
      mockRepositories.filter(
        (repository) =>
          repository.ownerId === currentUser.id || repository.isSaved
      ),
    [currentUser.id]
  )
  const [repositories, setRepositories] = useState(initialRepositories)
  const [filters, setFilters] = useState(initialFilters)
  const [view, setView] = useState("list")

  const filteredRepositories = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = repositories.filter((repository) => {
      const matchesQuery = !query || getSearchText(repository).includes(query)

      return matchesQuery
    })

    return sortRepositories(filtered, filters.sort)
  }, [filters, repositories])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function handleCreateRepository(form) {
    const createdAt = new Date().toISOString()
    const category = form.category || "General Notes"
    const titleSlug = createSlug(form.title) || "prototype-repository"

    setRepositories((currentRepositories) => [
      {
        allowAccessRequests: form.allowAccessRequests,
        category,
        createdAt,
        citationCount: 0,
        description:
          form.description ||
          "Prototype repository created locally for the ReNote workspace preview.",
        fileCount: 0,
        folderCount: 0,
        id: `repo-${titleSlug}-${Date.now()}`,
        includedTopics: [],
        isSaved: true,
        learningObjectives: [],
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerRole: currentUser.role,
        status: "active",
        subject: category,
        summaryCount: 0,
        tags: form.tags.length > 0 ? form.tags : ["prototype"],
        title: form.title,
        trustLabel: currentUser.trustLabel ?? "community",
        updatedAt: createdAt,
        views: 0,
        visibility: form.visibility,
      },
      ...currentRepositories,
    ])

    toast("Repository created in prototype mode.")
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={<CreateRepositoryDialog onCreate={handleCreateRepository} />}
        description="Manage the academic repositories you created, organized, or saved for review."
        title="My Repositories"
      />

      <RepositoryToolbar
        filters={filters}
        onFilterChange={updateFilter}
        onViewChange={setView}
        resultCount={filteredRepositories.length}
        view={view}
      />

      {filteredRepositories.length > 0 ? (
        <div
          className={cn(
            view === "grid"
              ? "grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
              : "space-y-4"
          )}
        >
          {filteredRepositories.map((repository) => (
            <RepositoryCard
              fileTypes={fileTypesByRepository.get(repository.id) ?? []}
              key={repository.id}
              repository={repository}
              view={view}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try adjusting your search or sort option."
          icon={Search}
          title="No repositories found"
        />
      )}
    </PageShell>
  )
}

export default MyRepositoriesPage
