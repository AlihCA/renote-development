import { useMemo, useState } from "react"
import { Library, Search } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PublicRepositoryCard from "@/components/repositories/PublicRepositoryCard"
import RepositoryFilterBar from "@/components/repositories/RepositoryFilterBar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockFiles, mockRepositories } from "@/data"

const initialFilters = {
  fileType: "all",
  query: "",
  sort: "newest",
  subject: "all",
  trust: "all",
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function normalizeFileType(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "")

  if (normalized.includes("pdf")) {
    return "pdf"
  }

  if (["doc", "docx"].includes(normalized)) {
    return "document"
  }

  if (["xls", "xlsx"].includes(normalized)) {
    return "spreadsheet"
  }

  if (["ppt", "pptx"].includes(normalized)) {
    return "presentation"
  }

  if (["image", "png", "jpg", "jpeg"].includes(normalized)) {
    return "image"
  }

  if (["link", "url"].includes(normalized)) {
    return "link"
  }

  return "file"
}

function getRepositoryFileTypes(repositoryId) {
  return [
    ...new Set(
      mockFiles
        .filter((file) => file.repositoryId === repositoryId)
        .map((file) => normalizeFileType(file.extension ?? file.type))
    ),
  ]
}

function getRepositorySearchText(repository, fileTypes) {
  return [
    repository.title,
    repository.description,
    repository.ownerName,
    repository.ownerRole,
    repository.subject,
    repository.trustLabel,
    repository.visibility,
    ...repository.tags,
    ...fileTypes,
  ]
    .join(" ")
    .toLowerCase()
}

function sortRepositories(repositories, sort) {
  return [...repositories].sort((first, second) => {
    if (sort === "views") {
      return second.views - first.views
    }

    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    return new Date(second.updatedAt) - new Date(first.updatedAt)
  })
}

function PublicExplorePage() {
  const [filters, setFilters] = useState(initialFilters)

  const repositories = useMemo(
    () =>
      mockRepositories
        .filter((repository) => repository.status === "active")
        .filter((repository) => ["public", "restricted"].includes(repository.visibility))
        .map((repository) => ({
          ...repository,
          fileTypes: getRepositoryFileTypes(repository.id),
        })),
    []
  )

  const subjectOptions = useMemo(
    () => [
      { label: "All subjects", value: "all" },
      ...[...new Set(repositories.map((repository) => repository.subject))]
        .sort((first, second) => first.localeCompare(second))
        .map((subject) => ({ label: subject, value: subject })),
    ],
    [repositories]
  )

  const fileTypeOptions = useMemo(
    () => [
      { label: "All file types", value: "all" },
      ...[...new Set(repositories.flatMap((repository) => repository.fileTypes))]
        .sort((first, second) => first.localeCompare(second))
        .map((fileType) => ({ label: toLabel(fileType), value: fileType })),
    ],
    [repositories]
  )

  const trustOptions = useMemo(
    () => [
      { label: "All trust labels", value: "all" },
      ...[...new Set(repositories.map((repository) => repository.trustLabel))]
        .sort((first, second) => first.localeCompare(second))
        .map((trust) => ({ label: toLabel(trust), value: trust })),
    ],
    [repositories]
  )

  const filteredRepositories = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = repositories.filter((repository) => {
      const matchesQuery =
        !query || getRepositorySearchText(repository, repository.fileTypes).includes(query)
      const matchesSubject =
        filters.subject === "all" || repository.subject === filters.subject
      const matchesFileType =
        filters.fileType === "all" || repository.fileTypes.includes(filters.fileType)
      const matchesTrust =
        filters.trust === "all" || repository.trustLabel === filters.trust

      return matchesQuery && matchesSubject && matchesFileType && matchesTrust
    })

    return sortRepositories(filtered, filters.sort)
  }, [filters, repositories])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  return (
    <div className="bg-background">
      <section className="border-b bg-muted/35">
        <div className="renote-container py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.65fr)] lg:items-end">
            <div className="max-w-3xl space-y-5">
              <Badge
                className="gap-2 rounded-2xl border-primary/20 bg-background/85 px-3 py-1.5 text-primary shadow-sm"
                variant="outline"
              >
                <Library className="size-3.5" />
                Public academic library
              </Badge>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Explore Public Resources
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Browse public academic repositories, reviewers, notes, and
                  learning materials shared through ReNote.
                </p>
              </div>
            </div>

            <label className="space-y-2">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Search the public library
              </span>
              <div className="renote-input-shell bg-background/90">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="Search repositories, owners, subjects, or tags"
                  type="search"
                  value={filters.query}
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="renote-container space-y-6 py-8 sm:py-10">
        <RepositoryFilterBar
          fileTypeOptions={fileTypeOptions}
          filters={filters}
          onFilterChange={updateFilter}
          subjectOptions={subjectOptions}
          trustOptions={trustOptions}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Public repository results
            </h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredRepositories.length} of {repositories.length} guest-friendly
              resource previews.
            </p>
          </div>
          <Badge className="w-fit" variant="secondary">
            Public and restricted previews
          </Badge>
        </div>

        {filteredRepositories.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredRepositories.map((repository) => (
              <PublicRepositoryCard
                fileTypes={repository.fileTypes}
                key={repository.id}
                repository={repository}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Try adjusting your search or filters."
            icon={Library}
            title="No public resources found"
          />
        )}
      </section>
    </div>
  )
}

export default PublicExplorePage
