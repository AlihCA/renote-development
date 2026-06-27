import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  FileQuestion,
  FileText,
  GraduationCap,
  Grid2x2,
  LayoutTemplate,
  Library,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import FileTypeIcon from "@/components/files/FileTypeIcon"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockCollections,
  mockFiles,
  mockRepositories,
  mockSummaries,
} from "@/data"

const defaultCover = {
  coverLabel: "General Study",
  coverGradient: "linear-gradient(135deg, #FDF2FF 0%, #F5E8FF 50%, #EEF2FF 100%)",
  coverIcon: "grid",
}

const coverIconMap = {
  book: BookOpen,
  bookmark: Bookmark,
  document: FileText,
  graduation: GraduationCap,
  grid: Grid2x2,
  library: Library,
  shield: ShieldCheck,
  template: LayoutTemplate,
}

const tabOptions = [
  { label: "All", value: "all" },
  { label: "Repositories", value: "repository" },
  { label: "Files", value: "file" },
  { label: "Links", value: "link" },
  { label: "Summaries", value: "summary" },
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getCollectionCover(collection) {
  return {
    coverLabel: collection.coverLabel ?? defaultCover.coverLabel,
    coverGradient: collection.coverGradient ?? defaultCover.coverGradient,
    coverIcon: collection.coverIcon ?? defaultCover.coverIcon,
  }
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

function getFileKind(file) {
  return String(file.extension ?? file.type ?? "file").toLowerCase()
}

function getFileTypeLabel(file) {
  const kind = getFileKind(file)

  if (["url", "link"].includes(kind)) return "Link"
  if (kind === "pdf") return "PDF"
  if (["doc", "docx"].includes(kind)) return "Document"
  if (["ppt", "pptx"].includes(kind)) return "Presentation"
  if (["xls", "xlsx"].includes(kind)) return "Spreadsheet"

  return kind.toUpperCase()
}

function getSavedItems(collection) {
  const { files, repositories, summaries } = getCollectionResources(collection)

  return [
    ...repositories.map((repository) => ({
      date: repository.updatedAt,
      description: repository.description,
      href: `/app/workspace/${repository.id}`,
      id: repository.id,
      label: "Repository",
      source: repository.ownerName,
      tags: repository.tags ?? [],
      title: repository.title,
      type: "repository",
    })),
    ...files.map((file) => {
      const kind = getFileKind(file)
      const isLink = ["url", "link"].includes(kind)

      return {
        date: file.updatedAt ?? file.uploadedAt,
        description: isLink
          ? "External academic resource saved to this study board."
          : `${getFileTypeLabel(file)} file from the saved repository.`,
        extension: file.extension ?? file.type,
        href: `/app/files/${file.id}`,
        id: file.id,
        label: getFileTypeLabel(file),
        source: file.size,
        tags: [getFileTypeLabel(file), file.ownerName].filter(Boolean),
        title: file.name,
        type: isLink ? "link" : "file",
      }
    }),
    ...summaries.map((summary) => ({
      date: summary.generatedAt,
      description: summary.preview,
      href: `/app/summaries/${summary.id}`,
      id: summary.id,
      label: "Summary",
      source: summary.mode,
      tags: [summary.mode, summary.repositoryTitle].filter(Boolean),
      title: summary.title,
      type: "summary",
    })),
  ].sort((first, second) => new Date(second.date) - new Date(first.date))
}

function getTabCount(items, tabValue) {
  if (tabValue === "all") {
    return items.length
  }

  return items.filter((item) => item.type === tabValue).length
}

function CoverIcon({ collection, className }) {
  const cover = getCollectionCover(collection)
  const Icon = coverIconMap[cover.coverIcon] ?? Grid2x2

  return <Icon className={className} />
}

function CollectionCoverBadge({ collection }) {
  const cover = getCollectionCover(collection)

  return (
    <span
      className="grid size-14 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/80 text-primary shadow-sm dark:border-primary/20"
      style={{ background: cover.coverGradient }}
    >
      <CoverIcon collection={collection} className="size-6" />
    </span>
  )
}

function AddItemDropdown({ className, variant = "default" }) {
  function handleAddItem() {
    toast("Adding saved items will be connected later.")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} type="button" variant={variant}>
          <Plus className="size-4" />
          Add Item
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Add saved item</DropdownMenuLabel>
        {["Repository", "File", "Link", "Summary"].map((item) => (
          <DropdownMenuItem key={item} onSelect={() => handleAddItem(item)}>
            <Plus className="size-4" />
            Add {item.toLowerCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="More collection actions" size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Collection actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Edit collection will be connected later.")}>
          <Pencil className="size-4" />
          Edit details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Archive collection will be connected later.")}>
          <Archive className="size-4" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast("Delete collection will be connected later.")}
          variant="destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SavedItemIcon({ item }) {
  if (item.type === "file" || item.type === "link") {
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

function SavedItemMoreMenu({ item }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={`More actions for ${item.title}`} size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Saved item actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Notes will be connected later.")}>
          <Pencil className="size-4" />
          Add note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast("Removing saved items will be connected later.")}
          variant="destructive"
        >
          <Trash2 className="size-4" />
          Remove from board
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SavedItemRow({ item }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5 sm:flex-row sm:items-center">
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
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge
              className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
              key={tag}
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <p className="w-full text-xs text-muted-foreground sm:text-right">
          {item.source} - Updated {formatDate(item.date)}
        </p>
        <SavedItemMoreMenu item={item} />
        <Button asChild size="sm" variant="outline">
          <Link to={item.href}>
            Open
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

function CollectionHeader({ collection }) {
  return (
    <section className="renote-card space-y-5 p-4 sm:p-5">
      <nav
        aria-label="Collection location"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link className="transition hover:text-primary" to="/app/collections">
          Collections
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-foreground">{collection.title}</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <CollectionCoverBadge collection={collection} />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {collection.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {collection.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(collection.previewTags ?? []).map((tag) => (
                <Badge
                  className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                  key={tag}
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">
                  {collection.savedCount ?? 0}
                </span>{" "}
                saved items
              </span>
              <span>Updated {formatDate(collection.updatedAt)}</span>
              <span>{getCollectionCover(collection).coverLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AddItemDropdown />
          <Button
            onClick={() => toast("Collection sharing will be connected later.")}
            type="button"
            variant="outline"
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <HeaderMoreMenu />
        </div>
      </div>
    </section>
  )
}

function CollectionDetailsPage() {
  const { collectionId } = useParams()
  const [activeTab, setActiveTab] = useState("all")
  const collection = mockCollections.find((item) => item.id === collectionId)
  const savedItems = useMemo(
    () => (collection ? getSavedItems(collection) : []),
    [collection]
  )
  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return savedItems
    }

    return savedItems.filter((item) => item.type === activeTab)
  }, [activeTab, savedItems])

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
      <Button asChild className="w-fit" variant="ghost">
        <Link to="/app/collections">
          <ArrowLeft className="size-4" />
          Back to Collections
        </Link>
      </Button>

      <CollectionHeader collection={collection} />

      <Tabs
        className="space-y-4"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="min-w-max border border-[#E9C8F2]/70 bg-[#FCF7FF] dark:border-primary/20 dark:bg-primary/5">
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {getTabCount(savedItems, tab.value)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <SavedItemRow item={item} key={`${item.type}-${item.id}`} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={<AddItemDropdown />}
          description="Add repositories, files, links, or summaries to build this study board."
          icon={Search}
          title="No saved items yet"
        />
      )}
    </PageShell>
  )
}

export default CollectionDetailsPage
