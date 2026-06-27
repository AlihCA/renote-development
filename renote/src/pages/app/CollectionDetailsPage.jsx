import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  Grid2x2,
  Plus,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  mockCollections,
  mockFiles,
  mockRepositories,
  mockSummaries,
} from "@/data"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getCollectionResources(collection) {
  const repositoryIds = collection.repositoryIds ?? []
  const repositories = repositoryIds
    .map((repositoryId) =>
      mockRepositories.find((repository) => repository.id === repositoryId)
    )
    .filter(Boolean)
  const files = mockFiles.filter((file) => repositoryIds.includes(file.repositoryId))
  const summaries = mockSummaries.filter((summary) =>
    repositoryIds.includes(summary.repositoryId)
  )

  return {
    files,
    repositories,
    summaries,
  }
}

function getSavedItems(collection) {
  const { files, repositories, summaries } = getCollectionResources(collection)

  return [
    ...repositories.map((repository) => ({
      date: repository.updatedAt,
      description: repository.description,
      href: `/app/workspace/${repository.id}`,
      id: repository.id,
      label: repository.subject,
      title: repository.title,
      type: "repository",
    })),
    ...files.map((file) => ({
      date: file.updatedAt ?? file.uploadedAt,
      description: file.size,
      extension: file.extension ?? file.type,
      href: `/app/files/${file.id}`,
      id: file.id,
      label: (file.extension ?? file.type ?? "Link").toUpperCase(),
      title: file.name,
      type: "file",
    })),
    ...summaries.map((summary) => ({
      date: summary.generatedAt,
      description: summary.preview,
      href: `/app/summaries/${summary.id}`,
      id: summary.id,
      label: summary.mode,
      title: summary.title,
      type: "summary",
    })),
  ]
}

function sortSavedItems(items, sort) {
  return [...items].sort((first, second) => {
    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    if (sort === "type") {
      const typeComparison = first.type.localeCompare(second.type)

      if (typeComparison !== 0) {
        return typeComparison
      }

      return first.title.localeCompare(second.title)
    }

    return new Date(second.date) - new Date(first.date)
  })
}

function SavedItemIcon({ item }) {
  if (item.type === "file") {
    return <FileTypeIcon extension={item.extension ?? item.type} size="sm" />
  }

  if (item.type === "summary") {
    return (
      <span className="inline-grid size-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Sparkles className="size-4" />
      </span>
    )
  }

  return (
    <span className="inline-grid size-9 shrink-0 place-items-center rounded-xl border border-[#E9C8F2]/80 bg-[#FCF7FF] text-primary dark:border-primary/20 dark:bg-primary/5">
      <BookOpen className="size-4" />
    </span>
  )
}

function SavedItemRow({ item }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5 sm:flex-row sm:items-center">
      <SavedItemIcon item={item} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="font-semibold tracking-tight transition hover:text-primary"
            to={item.href}
          >
            {item.title}
          </Link>
          <Badge
            className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] text-xs text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
            variant="outline"
          >
            {item.label}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      </div>

      <p className="text-xs text-muted-foreground sm:text-right">
        Updated {formatDate(item.date)}
      </p>
    </article>
  )
}

function CollectionDetailsPage() {
  const { collectionId } = useParams()
  const [sort, setSort] = useState("updated")
  const collection = mockCollections.find((item) => item.id === collectionId)
  const savedItems = useMemo(
    () => (collection ? sortSavedItems(getSavedItems(collection), sort) : []),
    [collection, sort]
  )

  if (!collection) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/app/collections">Back to Collections</Link>
            </Button>
          }
          description="This prototype collection could not be found."
          icon={FileQuestion}
          title="Collection not found"
        />
      </PageShell>
    )
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/app/collections">
                <ArrowLeft className="size-4" />
                Collections
              </Link>
            </Button>
            <Button
              onClick={() => toast("Add saved item will be connected later.")}
              type="button"
            >
              <Plus className="size-4" />
              Add saved item
            </Button>
          </>
        }
        description={collection.description}
        icon={Grid2x2}
        title={collection.title}
      >
        <div className="flex flex-wrap gap-2">
          {(collection.previewTags ?? []).map((tag) => (
            <Badge
              className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] text-xs text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
              key={tag}
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </PageHeader>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {savedItems.length} saved repositories, files, and summaries.
        </p>
        <Select onValueChange={setSort} value={sort}>
          <SelectTrigger className="w-full border-border bg-background/80 sm:w-44">
            <SelectValue placeholder="Sort saved items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {savedItems.length > 0 ? (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <SavedItemRow item={item} key={`${item.type}-${item.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button
              onClick={() => toast("Add saved item will be connected later.")}
              type="button"
            >
              <Plus className="size-4" />
              Add saved item
            </Button>
          }
          description="Add repositories, files, links, or summaries to start building this study board."
          icon={Search}
          title="No saved items yet"
        />
      )}
    </PageShell>
  )
}

export default CollectionDetailsPage
