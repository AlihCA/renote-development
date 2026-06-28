import { useMemo, useState } from "react"
import {
  Archive,
  BookOpen,
  FileQuestion,
  FileText,
  FolderOpen,
  MoreHorizontal,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockArchive } from "@/data"
import { cn } from "@/lib/utils"

const initialFilters = {
  search: "",
  sort: "recent",
  tab: "all",
}

const archiveTabs = [
  { label: "All", value: "all" },
  { label: "Repositories", value: "repository" },
  { label: "Collections", value: "collection" },
  { label: "Summaries", value: "summary" },
  { label: "Files", value: "file" },
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getArchivedDate(item) {
  return item.archivedAt ?? item.deletedAt
}

function getTypeLabel(type) {
  if (type === "repository") return "Repository"
  if (type === "collection") return "Collection"
  if (type === "summary") return "Summary"
  if (type === "file") return "File"

  return "Item"
}

function getTypeIcon(type) {
  if (type === "repository") return BookOpen
  if (type === "collection") return FolderOpen
  if (type === "summary") return Sparkles
  if (type === "file") return FileText

  return Archive
}

function sortArchivedItems(items, sort) {
  return [...items].sort((first, second) => {
    if (sort === "oldest") {
      return new Date(getArchivedDate(first)) - new Date(getArchivedDate(second))
    }

    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    if (sort === "type") {
      return getTypeLabel(first.type).localeCompare(getTypeLabel(second.type))
    }

    return new Date(getArchivedDate(second)) - new Date(getArchivedDate(first))
  })
}

function ArchivedTypeIcon({ type }) {
  const Icon = getTypeIcon(type)

  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
      <Icon className="size-5" />
    </span>
  )
}

function ArchivedItemMenu({ item, onDelete, onRestore }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="More archived item actions" size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{getTypeLabel(item.type)} actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onRestore(item.id)}>
          <RotateCcw className="size-4" />
          Restore
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onDelete(item)} variant="destructive">
          <Trash2 className="size-4" />
          Delete permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ArchivedItemRow({ item, onDelete, onRestore }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 gap-3">
          <ArchivedTypeIcon type={item.type} />

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold tracking-tight">{item.title}</h2>
              <Badge
                className="rounded-lg border-[#E9C8F2] bg-white/80 text-xs text-muted-foreground dark:border-primary/20 dark:bg-background/60"
                variant="outline"
              >
                {getTypeLabel(item.type)}
              </Badge>
              <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
                Archived
              </Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Archived {formatDate(getArchivedDate(item))}</span>
              {item.originalLocation ? (
                <span>Original location: {item.originalLocation}</span>
              ) : null}
              {item.retentionDays ? (
                <span>{item.retentionDays} day recovery window</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <Button onClick={() => onRestore(item.id)} size="sm" type="button" variant="outline">
            <RotateCcw className="size-4" />
            Restore
          </Button>
          <Button onClick={() => onDelete(item)} size="sm" type="button" variant="outline">
            <Trash2 className="size-4" />
            Delete permanently
          </Button>
          <ArchivedItemMenu item={item} onDelete={onDelete} onRestore={onRestore} />
        </div>
      </div>
    </article>
  )
}

function DeleteArchiveDialog({ item, onConfirm, onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#E9C8F2]/80 bg-white dark:border-primary/20 dark:bg-popover">
        <DialogHeader>
          <DialogTitle>Delete permanently?</DialogTitle>
          <DialogDescription>
            This prototype action represents permanent removal. In the final system,
            this cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {getTypeLabel(item.type)} archived on {formatDate(getArchivedDate(item))}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} type="button" variant="destructive">
            <Trash2 className="size-4" />
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ArchiveTrashPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [archivedItems, setArchivedItems] = useState(mockArchive)
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const filteredItems = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const filtered = archivedItems.filter((item) => {
      const matchesTab = filters.tab === "all" || item.type === filters.tab

      if (!matchesTab) {
        return false
      }

      if (!query) {
        return true
      }

      const searchableText = [
        item.title,
        item.description,
        item.originalLocation,
        getTypeLabel(item.type),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })

    return sortArchivedItems(filtered, filters.sort)
  }, [archivedItems, filters])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function restoreItem(itemId) {
    setArchivedItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    )
    toast("Updated locally for this demo.")
  }

  function confirmPermanentDelete() {
    setDeleteCandidate(null)
    toast("Permanent deletion will be connected during backend integration.")
  }

  const hasActiveFilters =
    filters.search !== initialFilters.search ||
    filters.sort !== initialFilters.sort ||
    filters.tab !== initialFilters.tab

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <Button
            onClick={() =>
              toast("Permanent deletion will be connected during backend integration.")
            }
            type="button"
            variant="outline"
          >
            <Trash2 className="size-4" />
            Empty Trash
          </Button>
        }
        description="Review archived repositories, collections, summaries, and removed workspace items."
        icon={Archive}
        title="Archive / Trash"
      />

      <section className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <Tabs onValueChange={(value) => updateFilter("tab", value)} value={filters.tab}>
            <TabsList className="min-w-max border border-[#E9C8F2]/70 bg-[#FCF7FF] dark:border-primary/20 dark:bg-primary/5">
              {archiveTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                  <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {tab.value === "all"
                      ? archivedItems.length
                      : archivedItems.filter((item) => item.type === tab.value).length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <label className="relative block">
            <span className="sr-only">Search archived items</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-border bg-background/80 pl-9"
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search archived items"
              value={filters.search}
            />
          </label>

          <Select onValueChange={(value) => updateFilter("sort", value)} value={filters.sort}>
            <SelectTrigger className="w-full border-border bg-background/80">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently archived</SelectItem>
              <SelectItem value="oldest">Oldest archived</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} archived items.
          </p>
          {hasActiveFilters ? (
            <Button onClick={clearFilters} size="sm" type="button" variant="ghost">
              Clear filters
            </Button>
          ) : null}
        </div>
      </section>

      {filteredItems.length > 0 ? (
        <div className={cn("space-y-3", filteredItems.length === 0 && "hidden")}>
          {filteredItems.map((item) => (
            <ArchivedItemRow
              key={item.id}
              item={item}
              onDelete={setDeleteCandidate}
              onRestore={restoreItem}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button onClick={clearFilters} type="button">
              Clear filters
            </Button>
          }
          description="Archived repositories, collections, summaries, and files will appear here."
          icon={FileQuestion}
          title="No archived items found"
        />
      )}

      <DeleteArchiveDialog
        item={deleteCandidate}
        onConfirm={confirmPermanentDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteCandidate(null)
          }
        }}
        open={Boolean(deleteCandidate)}
      />
    </PageShell>
  )
}

export default ArchiveTrashPage
