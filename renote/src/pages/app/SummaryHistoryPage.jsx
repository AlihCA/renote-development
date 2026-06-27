import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  ArrowUpRight,
  Copy,
  FileQuestion,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockFiles, mockRepositories, mockSummaries } from "@/data"

const reviewNotice =
  "AI-generated summaries are intended for review assistance only. Users should verify summaries with the original file before using them for academic work."

const initialFilters = {
  query: "",
  sort: "generated",
  type: "all",
}

const summaryTypes = [
  { label: "All", value: "all" },
  { label: "Quick", value: "quick" },
  { label: "Detailed", value: "detailed" },
  { label: "Key Points", value: "key-points" },
  { label: "Study Guide", value: "study-guide" },
  { label: "Review Notes", value: "review-notes" },
  { label: "Important Concepts", value: "important-concepts" },
  { label: "Definitions", value: "definitions" },
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function normalize(value) {
  return String(value ?? "").toLowerCase()
}

function getModeKey(mode) {
  const value = normalize(mode)

  if (value.includes("quick")) return "quick"
  if (value.includes("detailed")) return "detailed"
  if (value.includes("key point")) return "key-points"
  if (value.includes("study guide")) return "study-guide"
  if (value.includes("review note")) return "review-notes"
  if (value.includes("important concept")) return "important-concepts"
  if (value.includes("definition")) return "definitions"

  return value.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function getSummarySource(summary) {
  const file = mockFiles.find((item) => item.id === summary.fileId)
  const repository =
    mockRepositories.find((item) => item.id === summary.repositoryId) ??
    mockRepositories.find((item) => item.id === file?.repositoryId)

  return {
    file,
    fileName: file?.name ?? summary.fileName ?? "Unknown source",
    repository,
    repositoryTitle:
      repository?.title ?? summary.repositoryTitle ?? "Repository source unavailable",
  }
}

function getSummaryConcepts(summary) {
  return [
    ...(summary.content?.importantConcepts ?? []),
    ...(summary.content?.reviewNotes ?? []),
    ...(summary.content?.definitions ?? []),
  ].slice(0, 4)
}

function getSearchText(summary) {
  const source = getSummarySource(summary)

  return [
    summary.title,
    summary.mode,
    summary.preview,
    source.fileName,
    source.repositoryTitle,
    ...(summary.content?.importantConcepts ?? []),
    ...(summary.content?.definitions ?? []),
    ...(summary.content?.reviewNotes ?? []),
  ]
    .join(" ")
    .toLowerCase()
}

function sortSummaries(summaries, sort) {
  return [...summaries].sort((first, second) => {
    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    if (sort === "source") {
      return getSummarySource(first).fileName.localeCompare(
        getSummarySource(second).fileName
      )
    }

    if (sort === "type") {
      return first.mode.localeCompare(second.mode)
    }

    return new Date(second.generatedAt) - new Date(first.generatedAt)
  })
}

async function copyText(value) {
  try {
    await globalThis.navigator?.clipboard?.writeText(value)
    toast("Summary copied.")
  } catch {
    toast("Summary copied.")
  }
}

function SummaryTypeBadge({ mode }) {
  return (
    <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
      {mode}
    </Badge>
  )
}

function SummaryCard({ summary }) {
  const source = getSummarySource(summary)
  const concepts = getSummaryConcepts(summary)

  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="inline-grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="text-lg font-semibold tracking-tight transition hover:text-primary"
              to={`/app/summaries/${summary.id}`}
            >
              {summary.title}
            </Link>
            <SummaryTypeBadge mode={summary.mode} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{source.fileName}</span>
            <span>{source.repositoryTitle}</span>
            <span>Generated {formatDate(summary.generatedAt)}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {summary.preview}
          </p>

          {concepts.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {concepts.map((concept) => (
                <Badge
                  className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                  key={concept}
                  variant="outline"
                >
                  {concept}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/summaries/${summary.id}`}>
              View Summary
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button
            onClick={() => copyText(summary.preview ?? summary.content?.overview ?? "")}
            size="sm"
            type="button"
            variant="outline"
          >
            <Copy className="size-4" />
            Copy
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="More summary actions" size="icon-sm" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Summary actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => toast("Share summary will be connected later.")}>
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Add to collection will be connected later.")}>
                Add to collection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => toast("Archive summary will be connected later.")}
                variant="destructive"
              >
                Archive summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  )
}

function SummaryHistoryPage() {
  const [filters, setFilters] = useState(initialFilters)

  const filteredSummaries = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = mockSummaries.filter((summary) => {
      const matchesQuery = !query || getSearchText(summary).includes(query)
      const matchesType =
        filters.type === "all" || getModeKey(summary.mode) === filters.type

      return matchesQuery && matchesType
    })

    return sortSummaries(filtered, filters.sort)
  }, [filters])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <Button
            onClick={() => toast("Summary generation will be connected later.")}
            type="button"
          >
            <Plus className="size-4" />
            Generate Summary
          </Button>
        }
        description="Review saved AI-generated summaries from repositories, files, and study materials."
        title="AI Summary History"
      />

      <section className="space-y-3">
        <label className="block">
          <span className="sr-only">Search summaries</span>
          <div className="renote-input-shell">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="Search summaries by title, source, or keyword"
              type="search"
              value={filters.query}
            />
          </div>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSummaries.length} saved summaries from your workspace.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              onValueChange={(value) => updateFilter("type", value)}
              value={filters.type}
            >
              <SelectTrigger className="w-full border-border bg-background/80 sm:w-52">
                <SelectValue placeholder="Summary type" />
              </SelectTrigger>
              <SelectContent>
                {summaryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => updateFilter("sort", value)}
              value={filters.sort}
            >
              <SelectTrigger className="w-full border-border bg-background/80 sm:w-52">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generated">Recently generated</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="source">Source file</SelectItem>
                <SelectItem value="type">Summary type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] px-4 py-3 text-sm leading-6 text-muted-foreground dark:border-primary/20 dark:bg-primary/5">
          {reviewNotice}
        </p>
      </section>

      {filteredSummaries.length > 0 ? (
        <div className="space-y-3">
          {filteredSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button onClick={clearFilters} type="button">
              Clear filters
            </Button>
          }
          description="Try adjusting your search or summary type filter."
          icon={FileQuestion}
          title="No summaries found"
        />
      )}
    </PageShell>
  )
}

export default SummaryHistoryPage
