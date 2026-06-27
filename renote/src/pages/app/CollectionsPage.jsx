import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  Eye,
  FileText,
  GraduationCap,
  Grid2x2,
  LayoutGrid,
  LayoutTemplate,
  Library,
  List,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Trash2,
  Users,
  X,
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
  DialogTrigger,
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
import { mockCollections, mockRepositories } from "@/data"
import { cn } from "@/lib/utils"

const initialFilters = {
  query: "",
  sort: "updated",
}

const defaultCover = {
  coverType: "default",
  coverLabel: "General Study",
  coverGradient: "linear-gradient(135deg, #FDF2FF 0%, #F5E8FF 50%, #EEF2FF 100%)",
  coverIcon: "grid",
}

const coverPresets = [
  {
    id: "research-thesis",
    coverType: "preset",
    coverLabel: "Research / Thesis",
    coverGradient: "linear-gradient(135deg, #FFF1F8 0%, #F5E8FF 52%, #EDE9FE 100%)",
    coverIcon: "graduation",
  },
  {
    id: "courses",
    coverType: "preset",
    coverLabel: "Courses",
    coverGradient: "linear-gradient(135deg, #F8FAFC 0%, #F3E8FF 48%, #E0F2FE 100%)",
    coverIcon: "book",
  },
  {
    id: "reviewers",
    coverType: "preset",
    coverLabel: "Reviewers",
    coverGradient: "linear-gradient(135deg, #FFF7ED 0%, #FDF2FF 45%, #EDE9FE 100%)",
    coverIcon: "bookmark",
  },
  {
    id: "templates",
    coverType: "preset",
    coverLabel: "Templates",
    coverGradient: "linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 48%, #FCE7F3 100%)",
    coverIcon: "template",
  },
  {
    id: "capstone",
    coverType: "preset",
    coverLabel: "Capstone",
    coverGradient: "linear-gradient(135deg, #FDF2FF 0%, #FAE8FF 42%, #E0E7FF 100%)",
    coverIcon: "template",
  },
  {
    id: "cybersecurity",
    coverType: "preset",
    coverLabel: "Cybersecurity",
    coverGradient: "linear-gradient(135deg, #FDF2FF 0%, #F3E8FF 48%, #DBEAFE 100%)",
    coverIcon: "shield",
  },
  {
    id: "general-study",
    coverType: "preset",
    coverLabel: "General Study",
    coverGradient: defaultCover.coverGradient,
    coverIcon: "grid",
  },
]

const initialForm = {
  coverPreset: "default",
  description: "",
  tags: [],
  title: "",
  visibility: "private",
}

const visibilityOptions = [
  {
    description: "Only you and invited collaborators can open this board.",
    Icon: Lock,
    label: "Private",
    value: "private",
  },
  {
    description: "Anyone can discover and view this study board.",
    Icon: Eye,
    label: "Public",
    value: "public",
  },
  {
    description: "Selected classmates can access this curated board.",
    Icon: Users,
    label: "Restricted",
    value: "restricted",
  },
]

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

function normalizeTag(value) {
  return value.trim().replace(/\s+/g, " ")
}

function createSlug(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getTagList(tags, draft) {
  const values = [...tags, normalizeTag(draft)].filter(Boolean)

  return values.filter((tag, index) => {
    const key = tag.toLowerCase()
    return values.findIndex((item) => item.toLowerCase() === key) === index
  })
}

function getCoverPreset(presetId) {
  if (presetId === "default") {
    return defaultCover
  }

  return coverPresets.find((preset) => preset.id === presetId) ?? defaultCover
}

function getCollectionCover(collection) {
  return {
    coverType: collection.coverType ?? defaultCover.coverType,
    coverLabel: collection.coverLabel ?? defaultCover.coverLabel,
    coverGradient: collection.coverGradient ?? defaultCover.coverGradient,
    coverIcon: collection.coverIcon ?? defaultCover.coverIcon,
  }
}

function getCollectionRepositories(collection) {
  const repositoryIds = collection.repositoryIds ?? []

  return repositoryIds
    .map((repositoryId) =>
      mockRepositories.find((repository) => repository.id === repositoryId)
    )
    .filter(Boolean)
}

function getSearchText(collection) {
  const repositories = getCollectionRepositories(collection)

  return [
    collection.title,
    collection.description,
    collection.visibility,
    collection.coverLabel,
    ...(collection.previewTags ?? []),
    ...repositories.map((repository) => repository.title),
    ...repositories.map((repository) => repository.subject),
  ]
    .join(" ")
    .toLowerCase()
}

function sortCollections(collections, sort) {
  return [...collections].sort((first, second) => {
    if (sort === "az") {
      return first.title.localeCompare(second.title)
    }

    if (sort === "saved") {
      return (second.savedCount ?? 0) - (first.savedCount ?? 0)
    }

    if (sort === "newest") {
      return (
        new Date(second.createdAt ?? second.updatedAt) -
        new Date(first.createdAt ?? first.updatedAt)
      )
    }

    return new Date(second.updatedAt) - new Date(first.updatedAt)
  })
}

function CoverIcon({ collection, className }) {
  const cover = getCollectionCover(collection)
  const Icon = coverIconMap[cover.coverIcon] ?? Grid2x2

  return <Icon className={className} />
}

function CollectionCover({ collection }) {
  const cover = getCollectionCover(collection)

  return (
    <div
      className="relative flex h-36 overflow-hidden rounded-lg border border-[#E9C8F2]/80 p-5 shadow-sm dark:border-primary/20"
      style={{ background: cover.coverGradient }}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <span className="grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/75 text-primary shadow-sm backdrop-blur dark:border-primary/20 dark:bg-background/75">
          <CoverIcon collection={collection} className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase text-primary/75">
            Study board
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-800">
            {cover.coverLabel}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute right-4 top-4 w-28 space-y-2 rounded-2xl border border-white/60 bg-white/45 p-3 backdrop-blur"
      >
        <span className="block h-2 w-16 rounded-full bg-white/80" />
        <span className="block h-2 w-20 rounded-full bg-white/65" />
        <span className="block h-8 rounded-xl border border-white/65 bg-white/50" />
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-8 size-32 rounded-full bg-white/35"
      />
    </div>
  )
}

function CollectionCoverBadge({ collection }) {
  const cover = getCollectionCover(collection)

  return (
    <span
      className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/80 text-primary shadow-sm dark:border-primary/20"
      style={{ background: cover.coverGradient }}
    >
      <CoverIcon collection={collection} className="size-5" />
    </span>
  )
}

function handleMenuAction(label) {
  toast(`${label} is a prototype action.`)
}

function CollectionActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Collection actions" size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Collection actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleMenuAction("Edit collection")}>
          <Pencil className="size-4" />
          Edit collection
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleMenuAction("Share collection")}>
          <Share2 className="size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => handleMenuAction("Delete collection")}
          variant="destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CollectionTags({ collection, className }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {(collection.previewTags ?? []).slice(0, 3).map((tag) => (
        <Badge
          className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
          key={tag}
          variant="outline"
        >
          {tag}
        </Badge>
      ))}
    </div>
  )
}

function CollectionMeta({ collection, className }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <span className="font-semibold text-foreground">
        {collection.savedCount ?? 0}
      </span>{" "}
      saved - Updated {formatDate(collection.updatedAt)}
    </p>
  )
}

function CollectionGridCard({ collection }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5">
      <CollectionCover collection={collection} />

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              className="line-clamp-2 text-lg font-semibold tracking-tight transition hover:text-primary"
              to={`/app/collections/${collection.id}`}
            >
              {collection.title}
            </Link>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {collection.description}
            </p>
          </div>

          <CollectionActionsMenu />
        </div>

        <CollectionTags collection={collection} className="mt-4" />

        <div className="mt-auto flex flex-col gap-3 border-t border-[#E9C8F2]/70 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-border">
          <CollectionMeta collection={collection} />
          <Button asChild size="sm" variant="outline">
            <Link to={`/app/collections/${collection.id}`}>
              Open collection
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

function CollectionListCard({ collection }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:bg-primary/5 sm:flex-row sm:items-center">
      <CollectionCoverBadge collection={collection} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="font-semibold tracking-tight transition hover:text-primary"
            to={`/app/collections/${collection.id}`}
          >
            {collection.title}
          </Link>
          <Badge
            className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] text-xs text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
            variant="outline"
          >
            {getCollectionCover(collection).coverLabel}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {collection.description}
        </p>
        <CollectionTags collection={collection} className="mt-3" />
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <CollectionMeta collection={collection} className="w-full sm:text-right" />
        <CollectionActionsMenu />
        <Button asChild size="sm" variant="outline">
          <Link to={`/app/collections/${collection.id}`}>
            Open collection
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

function CollectionsToolbar({
  filters,
  onFilterChange,
  onViewChange,
  resultCount,
  view,
}) {
  return (
    <section className="space-y-3">
      <label className="block">
        <span className="sr-only">Search collections</span>
        <div className="renote-input-shell">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
            onChange={(event) => onFilterChange("query", event.target.value)}
            placeholder="Search collections"
            type="search"
            value={filters.query}
          />
        </div>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} study boards from your workspace.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            onValueChange={(value) => onFilterChange("sort", value)}
            value={filters.sort}
          >
            <SelectTrigger className="w-44 border-border bg-background/80">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="saved">Most saved</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-2xl border bg-background/80 p-1">
            <Button
              aria-label="Board view"
              onClick={() => onViewChange("board")}
              size="icon-sm"
              type="button"
              variant={view === "board" ? "secondary" : "ghost"}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              aria-label="List view"
              onClick={() => onViewChange("list")}
              size="icon-sm"
              type="button"
              variant={view === "list" ? "secondary" : "ghost"}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function VisibilityOptionCard({ Icon, description, isSelected, label, onSelect }) {
  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "flex h-full rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
        isSelected
          ? "border-primary/45 bg-primary/10 text-foreground"
          : "border-[#E9C8F2]/80 bg-white/80 hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/60 dark:hover:bg-primary/5"
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className={cn(
          "mr-3 grid size-10 shrink-0 place-items-center rounded-2xl border",
          isSelected
            ? "border-primary/20 bg-white text-primary dark:bg-background/80"
            : "border-[#E9C8F2]/70 bg-[#FCF7FF] text-primary/80 dark:border-primary/20 dark:bg-primary/5"
        )}
      >
        <Icon className="size-4" />
      </span>

      <span className="min-w-0 flex-1 space-y-1">
        <span className="block font-semibold">{label}</span>
        <span className="block text-sm leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={cn(
          "ml-3 grid size-5 shrink-0 place-items-center rounded-full border",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-[#E9C8F2] bg-white dark:border-primary/20 dark:bg-background"
        )}
      >
        {isSelected ? <Check className="size-3" /> : null}
      </span>
    </button>
  )
}

function CoverOptionButton({ cover, isSelected, label, onSelect }) {
  const previewCollection = {
    coverGradient: cover.coverGradient,
    coverIcon: cover.coverIcon,
    coverLabel: cover.coverLabel,
    coverType: cover.coverType,
  }

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
        isSelected
          ? "border-primary/45 bg-primary/10"
          : "border-[#E9C8F2]/80 bg-white/80 hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/60 dark:hover:bg-primary/5"
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#E9C8F2]/80 text-primary shadow-sm dark:border-primary/20"
        style={{ background: cover.coverGradient }}
      >
        <CoverIcon collection={previewCollection} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {cover.coverLabel}
        </span>
      </span>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-[#E9C8F2] bg-white dark:border-primary/20 dark:bg-background"
        )}
      >
        {isSelected ? <Check className="size-3" /> : null}
      </span>
    </button>
  )
}

function CreateCollectionDialog({ onCreate }) {
  const [form, setForm] = useState(initialForm)
  const [isOpen, setIsOpen] = useState(false)
  const [tagDraft, setTagDraft] = useState("")

  function updateField(key, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function handleAddTag() {
    const nextTag = normalizeTag(tagDraft)

    if (!nextTag) {
      return
    }

    setForm((currentForm) => ({
      ...currentForm,
      tags: getTagList(currentForm.tags, nextTag),
    }))
    setTagDraft("")
  }

  function handleTagKeyDown(event) {
    if (event.key !== "Enter") {
      return
    }

    event.preventDefault()
    handleAddTag()
  }

  function handleRemoveTag(tagToRemove) {
    setForm((currentForm) => ({
      ...currentForm,
      tags: currentForm.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    const cover = getCoverPreset(form.coverPreset)

    onCreate({
      ...form,
      ...cover,
      description: form.description.trim(),
      previewTags: getTagList(form.tags, tagDraft),
      title: form.title.trim(),
    })

    setForm(initialForm)
    setTagDraft("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-[#E9C8F2]/80 bg-white p-6 shadow-xl dark:border-primary/20 dark:bg-popover sm:max-w-2xl sm:p-7 lg:max-w-3xl">
        <DialogHeader className="gap-2 pr-10">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create Collection
          </DialogTitle>
          <DialogDescription>
            Start a study board for saved repositories, files, links, and summaries.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">
              Collection name
            </span>
            <Input
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Capstone References"
              required
              value={form.title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">
              Description
            </span>
            <textarea
              className="min-h-28 w-full resize-none rounded-2xl border border-[#E9C8F2]/80 bg-background/80 px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary/45 focus-visible:ring-3 focus-visible:ring-primary/20 dark:border-primary/20"
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Describe what this study board is for."
              value={form.description}
            />
          </label>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Cover</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <CoverOptionButton
                cover={defaultCover}
                isSelected={form.coverPreset === "default"}
                label="Use default cover"
                onSelect={() => updateField("coverPreset", "default")}
              />
              {coverPresets.map((preset) => (
                <CoverOptionButton
                  cover={preset}
                  isSelected={form.coverPreset === preset.id}
                  key={preset.id}
                  label={preset.coverLabel}
                  onSelect={() => updateField("coverPreset", preset.id)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="collection-tag"
              >
                Tags
              </label>
              <p className="text-sm text-muted-foreground">
                Add a few labels so the board is easier to find later.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="collection-tag"
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag"
                value={tagDraft}
              />
              <Button
                className="w-full sm:w-auto"
                onClick={handleAddTag}
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add Tag
              </Button>
            </div>

            {form.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E9C8F2] bg-[#FCF7FF] px-3 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                    key={tag}
                  >
                    {tag}
                    <button
                      aria-label={`Remove ${tag}`}
                      className="rounded-full text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Choose who can view this study board.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {visibilityOptions.map((option) => (
                <VisibilityOptionCard
                  {...option}
                  isSelected={form.visibility === option.value}
                  key={option.value}
                  onSelect={() => updateField("visibility", option.value)}
                />
              ))}
            </div>
          </section>

          <DialogFooter className="border-t border-[#E9C8F2]/70 pt-5 dark:border-border">
            <DialogClose asChild>
              <Button className="w-full sm:w-auto" type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full sm:w-auto" type="submit">
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CollectionsPage() {
  const [collections, setCollections] = useState(mockCollections)
  const [filters, setFilters] = useState(initialFilters)
  const [view, setView] = useState("board")

  const filteredCollections = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const filtered = collections.filter((collection) => {
      return !query || getSearchText(collection).includes(query)
    })

    return sortCollections(filtered, filters.sort)
  }, [collections, filters])

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  function handleCreateCollection(form) {
    const createdAt = new Date().toISOString()
    const titleSlug = createSlug(form.title) || "prototype-collection"

    setCollections((currentCollections) => [
      {
        coverGradient: form.coverGradient,
        coverIcon: form.coverIcon,
        coverLabel: form.coverLabel,
        coverType: form.coverType,
        createdAt,
        description:
          form.description ||
          "Prototype study board created locally for the ReNote workspace preview.",
        id: `collection-${titleSlug}-${Date.now()}`,
        ownerId: "user-student-mia",
        previewTags: form.previewTags.length > 0 ? form.previewTags : ["study board"],
        repositoryIds: [],
        savedCount: 0,
        title: form.title,
        updatedAt: createdAt,
        visibility: form.visibility,
      },
      ...currentCollections,
    ])

    toast("Collection created in prototype mode.")
  }

  return (
    <PageShell className="space-y-7" size="wide">
      <PageHeader
        actions={<CreateCollectionDialog onCreate={handleCreateCollection} />}
        description="Curate saved repositories, files, links, and summaries into focused study boards."
        title="Collections"
      />

      <CollectionsToolbar
        filters={filters}
        onFilterChange={updateFilter}
        onViewChange={setView}
        resultCount={filteredCollections.length}
        view={view}
      />

      {filteredCollections.length > 0 ? (
        view === "board" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCollections.map((collection) => (
              <CollectionGridCard collection={collection} key={collection.id} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCollections.map((collection) => (
              <CollectionListCard collection={collection} key={collection.id} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          action={<CreateCollectionDialog onCreate={handleCreateCollection} />}
          description="Try adjusting your search or create a new study board."
          icon={Search}
          title="No collections found"
        />
      )}
    </PageShell>
  )
}

export default CollectionsPage
