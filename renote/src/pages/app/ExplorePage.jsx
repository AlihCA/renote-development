import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import {
  ArrowUpRight,
  Filter,
  KeyRound,
  Library,
  Search,
  Star,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import Pagination from "@/components/repositories/Pagination"
import RepositoryFilterPanel from "@/components/repositories/RepositoryFilterPanel"
import RepositoryMetricsRow from "@/components/repositories/RepositoryMetricsRow"
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
import { cn } from "@/lib/utils"
import { matchesRepositorySearch } from "@/utils/semanticSearch"

const pageSize = 5

const initialFilters = {
  excludeTags: [],
  includeTags: [],
  query: "",
  sort: "newest",
  subject: "all",
  trust: "all",
  visibility: "all",
}

const suggestedSearches = [
  "Thesis documentation",
  "Cybersecurity reviewers",
  "Database normalization",
]

function normalizeTag(value) {
  return String(value).trim().toLowerCase()
}

function normalizeFileType(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "")

  if (normalized.includes("pdf")) return "pdf"
  if (["doc", "docx"].includes(normalized)) return "document"
  if (["xls", "xlsx"].includes(normalized)) return "spreadsheet"
  if (["ppt", "pptx"].includes(normalized)) return "presentation"
  if (["image", "png", "jpg", "jpeg"].includes(normalized)) return "image"
  if (["link", "url"].includes(normalized)) return "link"

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

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getResultRange(currentPage, totalResults) {
  if (totalResults === 0) {
    return "Showing 0 repositories"
  }

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalResults)

  return `Showing ${start}-${end} of ${totalResults} repositories`
}

function SignedInRepositoryCard({ fileTypes, repository }) {
  const canRequestAccess = ["private", "restricted"].includes(repository.visibility)

  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="min-w-0 text-lg font-semibold tracking-tight transition hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25"
              to={`/app/repositories/${repository.id}`}
            >
              {repository.title}
            </Link>
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>

          <p className="line-clamp-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {repository.tags.slice(0, 4).map((tag) => (
              <Badge
                className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <RepositoryMetricsRow repository={repository} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[#E9C8F2]/70 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-border">
        <div className="flex items-center gap-2">
          {fileTypes.slice(0, 4).map((fileType) => (
            <FileTypeIcon
              className="size-7 rounded-lg shadow-none"
              extension={fileType}
              key={fileType}
              size="sm"
            />
          ))}
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(repository.updatedAt)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/repositories/${repository.id}`}>
              View Details
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
            Save
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
        </div>
      </div>
    </article>
  )
}

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    ...initialFilters,
    query: urlQuery,
  })
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
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
    const filtered = repositories.filter((repository) => {
      const matchesQuery = matchesRepositorySearch(
        repository,
        filters.query,
        "semantic"
      )
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
  const totalPages = Math.max(1, Math.ceil(filteredRepositories.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRepositories = filteredRepositories.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
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

  function handleSuggestedSearch(value) {
    setCurrentPage(1)
    updateSearchQuery(value)
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

  function renderFilterPanel({ onClose } = {}) {
    return (
      <RepositoryFilterPanel
        filters={filters}
        onAddTag={addTag}
        onClose={onClose}
        onFilterChange={updateFilter}
        onRemoveTag={removeTag}
        onReset={resetFilters}
        subjectOptions={subjectOptions}
      />
    )
  }

  const hasSearchQuery = Boolean(filters.query.trim())
  const emptyStateTitle = hasSearchQuery
    ? "No matching repositories found"
    : "No repositories found"
  const emptyStateDescription = hasSearchQuery
    ? "Try another title, owner, subject, tag, or related academic topic."
    : "Try adjusting your search, include tags, exclude tags, or filters."

  return (
    <PageShell
      className={cn(
        "w-full max-w-none space-y-7 overflow-visible px-4 sm:px-6 lg:px-8",
        isFilterPanelOpen && "xl:pr-[26rem] 2xl:pr-[27.5rem]"
      )}
      size="wide"
    >
      <PageHeader
        description="Discover academic repositories shared through ReNote."
        title="Explore"
      />

      <div className="w-full min-w-0">
        <main className="min-w-0 space-y-5">
          <section className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Search repositories</span>
                <div className="renote-input-shell">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                    onChange={(event) => updateFilter("query", event.target.value)}
                    placeholder="Search by title, owner, subject, tag, or topic"
                    type="search"
                    value={filters.query}
                  />
                </div>
                <p className="mt-2 px-1 text-xs leading-5 text-muted-foreground">
                  Smart search prototype uses titles, tags, subjects, and
                  descriptions.
                </p>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row lg:items-start">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full sm:w-fit xl:hidden" variant="outline">
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
                        Refine signed-in repository results.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-4">{renderFilterPanel()}</div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {getResultRange(safeCurrentPage, filteredRepositories.length)}
            </p>
          </section>

          <section className="rounded-2xl border border-[#E9C8F2]/70 bg-white/80 p-3 dark:border-primary/20 dark:bg-card/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Recommended topics</p>
                <p className="text-xs text-muted-foreground">
                  Quick prototype searches based on common academic activity.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((suggestion) => (
                  <Button
                    key={suggestion}
                    onClick={() => handleSuggestedSearch(suggestion)}
                    size="xs"
                    type="button"
                    variant="outline"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {paginatedRepositories.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedRepositories.map((repository) => (
                  <SignedInRepositoryCard
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
              action={
                <Button onClick={resetFilters} type="button">
                  Clear filters
                </Button>
              }
              description={emptyStateDescription}
              icon={Library}
              title={emptyStateTitle}
            />
          )}
        </main>
      </div>

      {isFilterPanelOpen ? (
        <aside className="fixed bottom-6 right-6 top-[calc(var(--app-topbar-height,4rem)+1.5rem)] z-20 hidden w-[360px] overflow-hidden xl:block 2xl:right-8 2xl:w-[380px]">
          {renderFilterPanel({ onClose: () => setIsFilterPanelOpen(false) })}
        </aside>
      ) : (
        <Button
          aria-expanded="false"
          className="fixed right-6 top-[calc(var(--app-topbar-height,4rem)+1.5rem)] z-20 hidden rounded-lg border-[#E9C8F2] bg-white shadow-sm hover:bg-primary-soft xl:inline-flex 2xl:right-8 dark:border-primary/25 dark:bg-card"
          onClick={() => setIsFilterPanelOpen(true)}
          type="button"
          variant="outline"
        >
          <Filter className="size-4" />
          Filters
        </Button>
      )}
    </PageShell>
  )
}

export default ExplorePage
