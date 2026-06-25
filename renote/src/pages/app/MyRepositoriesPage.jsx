import { useMemo, useState } from "react"
import {
  Archive,
  Eye,
  Library,
  Lock,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog"
import RepositoryCard from "@/components/repositories/RepositoryCard"
import RepositoryToolbar from "@/components/repositories/RepositoryToolbar"
import { mockRepositories, mockUsers } from "@/data"
import { cn } from "@/lib/utils"

const currentUserId = "user-student-mia"
const initialFilters = {
  query: "",
  sort: "updated",
  trust: "all",
  visibility: "all",
}

function normalize(value) {
  return String(value ?? "").toLowerCase()
}

function getSearchText(repository) {
  return [
    repository.title,
    repository.description,
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

    return new Date(second.updatedAt) - new Date(first.updatedAt)
  })
}

function createSlug(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function RepositoryStatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="renote-icon-container size-9">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-semibold leading-none">{value}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

function MyRepositoriesPage() {
  const currentUser =
    mockUsers.find((user) => user.id === currentUserId) ?? mockUsers[0]
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
  const [view, setView] = useState("grid")

  const stats = useMemo(
    () => ({
      archived: repositories.filter((repository) => repository.status === "archived")
        .length,
      private: repositories.filter((repository) => repository.visibility === "private")
        .length,
      public: repositories.filter((repository) => repository.visibility === "public")
        .length,
      restricted: repositories.filter(
        (repository) => repository.visibility === "restricted"
      ).length,
      total: repositories.length,
    }),
    [repositories]
  )

  const filteredRepositories = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = repositories.filter((repository) => {
      const matchesQuery = !query || getSearchText(repository).includes(query)
      const matchesVisibility =
        filters.visibility === "all" ||
        repository.visibility === filters.visibility
      const matchesTrust =
        filters.trust === "all" || repository.trustLabel === filters.trust

      return matchesQuery && matchesVisibility && matchesTrust
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
    const titleSlug = createSlug(form.title) || "prototype-repository"

    setRepositories((currentRepositories) => [
      {
        allowAccessRequests: form.allowAccessRequests,
        createdAt,
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
        subject: "Prototype Workspace",
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
        eyebrow="Workspace"
        icon={Library}
        title="My Repositories"
      >
        <p className="text-sm text-muted-foreground">
          Prototype workspace for {currentUser.name}.
        </p>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <RepositoryStatPill icon={Library} label="Total repositories" value={stats.total} />
        <RepositoryStatPill icon={Eye} label="Public" value={stats.public} />
        <RepositoryStatPill
          icon={Users}
          label="Restricted"
          value={stats.restricted}
        />
        <RepositoryStatPill icon={Lock} label="Private" value={stats.private} />
        <RepositoryStatPill icon={Archive} label="Archived" value={stats.archived} />
      </div>

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
              key={repository.id}
              repository={repository}
              view={view}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try adjusting your search or filters."
          icon={Search}
          title="No repositories found"
        />
      )}

      <div className="rounded-3xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Repository actions and creation are currently prototype-only. Backend
            storage, authentication, and real access management will be connected
            in a later phase.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

export default MyRepositoriesPage
