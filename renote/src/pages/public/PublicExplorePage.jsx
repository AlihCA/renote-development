import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { Filter, Library, Search } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import Pagination from "@/components/repositories/Pagination"
import PublicRepositoryCard from "@/components/repositories/PublicRepositoryCard"
import RepositoryFilterPanel from "@/components/repositories/RepositoryFilterPanel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { mockFiles, mockRepositories } from "@/data"

const PAGE_SIZE = 5

const initialFilters = {
  excludeTags: [],
  includeTags: [],
  query: "",
  sort: "newest",
  subject: "all",
  trust: "all",
  visibility: "all",
}

function normalizeTag(value) {
  return String(value).trim().toLowerCase()
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

function getRepositorySearchText(repository) {
  return [
    repository.title,
    repository.description,
    repository.ownerName,
    repository.ownerRole,
    repository.subject,
    repository.trustLabel,
    repository.visibility,
    ...repository.tags,
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

function getResultRange(currentPage, totalResults) {
  if (totalResults === 0) {
    return "Showing 0 repositories"
  }

  const start = (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, totalResults)

  return `Showing ${start}-${end} of ${totalResults} repositories`
}

function PublicExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    ...initialFilters,
    query: urlQuery,
  })

  const repositories = useMemo(
    () =>
      mockRepositories
        .filter((repository) => repository.status === "active")
        .map((repository) => ({
          ...repository,
          fileTypes: getRepositoryFileTypes(repository.id),
          normalizedTags: repository.tags.map(normalizeTag),
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

  const filteredRepositories = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = repositories.filter((repository) => {
      const matchesQuery = !query || getRepositorySearchText(repository).includes(query)
      const matchesSubject =
        filters.subject === "all" || repository.subject === filters.subject
      const matchesTrust =
        filters.trust === "all" || repository.trustLabel === filters.trust
      const matchesVisibility =
        filters.visibility === "all" || repository.visibility === filters.visibility
      const matchesIncludedTags =
        filters.includeTags.length === 0 ||
        filters.includeTags.some((tag) =>
          repository.normalizedTags.some((repositoryTag) =>
            repositoryTag.includes(tag)
          )
        )
      const matchesExcludedTags = !filters.excludeTags.some((tag) =>
        repository.normalizedTags.some((repositoryTag) => repositoryTag.includes(tag))
      )

      return (
        matchesQuery &&
        matchesSubject &&
        matchesTrust &&
        matchesVisibility &&
        matchesIncludedTags &&
        matchesExcludedTags
      )
    })

    return sortRepositories(filtered, filters.sort)
  }, [filters, repositories])

  const totalPages = Math.max(1, Math.ceil(filteredRepositories.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRepositories = filteredRepositories.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  )

  useEffect(() => {
    setCurrentPage(1)
    setFilters((currentFilters) =>
      currentFilters.query === urlQuery
        ? currentFilters
        : {
            ...currentFilters,
            query: urlQuery,
          }
    )
  }, [urlQuery])

  function updateSearchQuery(value) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (value.trim()) {
      nextSearchParams.set("q", value)
    } else {
      nextSearchParams.delete("q")
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  function updateFilter(key, value) {
    if (key === "query") {
      updateSearchQuery(value)
      return
    }

    setCurrentPage(1)
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function addTag(key, value) {
    const tag = normalizeTag(value)

    if (!tag) {
      return
    }

    setCurrentPage(1)
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: currentFilters[key].includes(tag)
        ? currentFilters[key]
        : [...currentFilters[key], tag],
    }))
  }

  function removeTag(key, value) {
    setCurrentPage(1)
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: currentFilters[key].filter((tag) => tag !== value),
    }))
  }

  function resetFilters() {
    setCurrentPage(1)
    setFilters(initialFilters)
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.delete("q")
    setSearchParams(nextSearchParams, { replace: true })
  }

  function renderFilterPanel() {
    return (
      <RepositoryFilterPanel
        filters={filters}
        onAddTag={addTag}
        onFilterChange={updateFilter}
        onRemoveTag={removeTag}
        onReset={resetFilters}
        subjectOptions={subjectOptions}
      />
    )
  }

  return (
    <div className="bg-background">
      <section className="border-b bg-muted/35">
        <div className="renote-container py-8 sm:py-10">
          <div className="max-w-3xl space-y-5">
            <Badge
              className="gap-2 rounded-2xl border-primary/20 bg-background/85 px-3 py-1.5 text-primary shadow-sm"
              variant="outline"
            >
              <Library className="size-3.5" />
              Public academic library
            </Badge>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight">
                Explore Public Resources
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Browse public academic repositories, reviewers, notes, and
                learning materials shared through ReNote.
              </p>
            </div>

            <label className="block max-w-2xl space-y-2 md:hidden">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Search repositories
              </span>
              <div className="renote-input-shell bg-background/90">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="Search by title, owner, subject, or tag"
                  type="search"
                  value={filters.query}
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="renote-container py-8 sm:py-10 lg:pr-[25rem]">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Repository results
              </h2>
              <p className="text-sm text-muted-foreground">
                {getResultRange(safeCurrentPage, filteredRepositories.length)}
              </p>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full sm:w-fit lg:hidden" variant="outline">
                  <Filter className="size-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-[22rem] max-w-[calc(100vw-1.5rem)] overflow-y-auto p-0"
                side="right"
              >
                <SheetHeader className="border-b px-5 py-5 text-left">
                  <SheetTitle>Sort and Filter</SheetTitle>
                  <SheetDescription>
                    Refine public repository results.
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4">{renderFilterPanel()}</div>
              </SheetContent>
            </Sheet>
          </div>

          {paginatedRepositories.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedRepositories.map((repository) => (
                  <PublicRepositoryCard
                    fileTypes={repository.fileTypes}
                    key={repository.id}
                    repository={repository}
                  />
                ))}
              </div>

              <Pagination
                currentPage={safeCurrentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
              />
            </>
          ) : (
            <EmptyState
              description="Try adjusting your search, include tags, exclude tags, or filters."
              icon={Library}
              title="No public resources found"
            />
          )}
        </div>

        <aside className="fixed bottom-8 right-8 top-24 z-30 hidden w-[22rem] overflow-y-auto pr-1 lg:block">
          {renderFilterPanel()}
        </aside>
      </section>
    </div>
  )
}

export default PublicExplorePage
