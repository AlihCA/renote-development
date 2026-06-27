import { useState } from "react"
import { Filter, Plus, RotateCcw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function FilterSelect({ label, onChange, options, value }) {
  return (
    <label className="block space-y-1.5">
      <span className="px-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="h-9 w-full rounded-lg border-[#E9C8F2] bg-white shadow-sm dark:border-border dark:bg-background/80">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function TagInput({ label, onAddTag, placeholder }) {
  const [value, setValue] = useState("")

  function submitTag(event) {
    event.preventDefault()
    onAddTag(value)
    setValue("")
  }

  return (
    <form className="space-y-1.5" onSubmit={submitTag}>
      <span className="px-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Input
          className="h-9 rounded-lg border-[#E9C8F2] bg-white shadow-sm dark:border-border dark:bg-background/80"
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <Button
          aria-label={`Add ${label.toLowerCase()}`}
          className="h-9 w-9 shrink-0 rounded-lg"
          type="submit"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </form>
  )
}

function TagChip({ onRemove, tag }) {
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9C8F2] bg-white px-2 py-0.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary dark:border-border dark:bg-background/80"
      onClick={() => onRemove(tag)}
      type="button"
    >
      {tag}
      <X className="size-3" />
    </button>
  )
}

function TagChips({ emptyLabel, onRemoveTag, tags }) {
  if (tags.length === 0) {
    return <p className="px-1 text-xs leading-tight text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <TagChip key={tag} onRemove={onRemoveTag} tag={tag} />
      ))}
    </div>
  )
}

function RepositoryFilterPanel({
  filters,
  onAddTag,
  onClose,
  onFilterChange,
  onRemoveTag,
  onReset,
  subjectOptions,
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[#E9C8F2] bg-white shadow-sm dark:border-primary/25 dark:bg-card">
      <div className="shrink-0 border-b border-[#E9C8F2]/70 px-4 py-4 dark:border-border">
        <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-[#E9C8F2] bg-[#FCF7FF] text-primary shadow-sm dark:border-primary/25 dark:bg-background/80">
            <Filter className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold leading-tight">Sort and Filter</h2>
            <p className="text-xs text-muted-foreground">Refine repositories</p>
          </div>
        </div>

        {onClose ? (
          <Button
            aria-label="Collapse filters"
            className="rounded-lg text-muted-foreground hover:text-primary"
            onClick={onClose}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>
      </div>
      

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 pr-3"> 
        <FilterSelect
          label="Sort by"
          onChange={(value) => onFilterChange("sort", value)}
          options={[
            { label: "Newest", value: "newest" },
            { label: "Most viewed", value: "views" },
            { label: "A-Z", value: "az" },
          ]}
          value={filters.sort}
        />

        <FilterSelect
          label="Subject / Category"
          onChange={(value) => onFilterChange("subject", value)}
          options={subjectOptions}
          value={filters.subject}
        />

        <FilterSelect
          label="Trust label"
          onChange={(value) => onFilterChange("trust", value)}
          options={[
            { label: "All trust labels", value: "all" },
            { label: "Community", value: "community" },
            { label: "Faculty", value: "faculty" },
            { label: "Official", value: "official" },
          ]}
          value={filters.trust}
        />

        <FilterSelect
          label="Visibility"
          onChange={(value) => onFilterChange("visibility", value)}
          options={[
            { label: "All visibility", value: "all" },
            { label: "Public", value: "public" },
            { label: "Restricted", value: "restricted" },
            { label: "Private preview", value: "private" },
          ]}
          value={filters.visibility}
        />

        <div className="space-y-1.5 border-t border-[#E9C8F2]/70 pt-3 dark:border-border">
          <TagInput
            label="Include tags"
            onAddTag={(tag) => onAddTag("includeTags", tag)}
            placeholder="e.g. research"
          />
          <TagChips
            emptyLabel="No include tags"
            onRemoveTag={(tag) => onRemoveTag("includeTags", tag)}
            tags={filters.includeTags}
          />
        </div>

        <div className="space-y-1.5 border-t border-[#E9C8F2]/70 pt-3 dark:border-border">
          <TagInput
            label="Exclude tags"
            onAddTag={(tag) => onAddTag("excludeTags", tag)}
            placeholder="e.g. archive"
          />
          <TagChips
            emptyLabel="No exclude tags"
            onRemoveTag={(tag) => onRemoveTag("excludeTags", tag)}
            tags={filters.excludeTags}
          />
        </div>

        <div className="shrink-0 border-t border-[#E9C8F2]/70 p-4 dark:border-border">
          <Button
            className="h-10 w-full rounded-lg border-[#E9C8F2] bg-[#FCF7FF] hover:bg-primary-soft dark:border-border dark:bg-background/80"
            onClick={onReset}
            type="button"
            variant="outline"
          >
            <RotateCcw className="size-4" />
            Reset Filters
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default RepositoryFilterPanel