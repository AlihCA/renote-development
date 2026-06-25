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
    <label className="block space-y-3">
      <span className="px-1 text-xs font-medium text-muted-foreground">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="h-11 w-full border-[#E9C8F2] bg-white shadow-sm dark:border-border dark:bg-background/80">
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
    <form className="space-y-3" onSubmit={submitTag}>
      <span className="px-1 text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2.5">
        <Input
          className="h-11 rounded-2xl border-[#E9C8F2] bg-white shadow-sm dark:border-border dark:bg-background/80"
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <Button aria-label={`Add ${label.toLowerCase()}`} size="icon" type="submit">
          <Plus className="size-4" />
        </Button>
      </div>
    </form>
  )
}

function TagChip({ onRemove, tag }) {
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9C8F2] bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary dark:border-border dark:bg-background/80"
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
    return <p className="px-1 text-xs text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagChip key={tag} onRemove={onRemoveTag} tag={tag} />
      ))}
    </div>
  )
}

function RepositoryFilterPanel({
  filters,
  onAddTag,
  onFilterChange,
  onRemoveTag,
  onReset,
  subjectOptions,
}) {
  return (
    <aside className="rounded-3xl border border-[#E9C8F2] bg-[#FCF5FF] p-7 shadow-sm dark:border-primary/25 dark:bg-card">
      <div className="mb-7 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl border border-[#E9C8F2] bg-white text-primary shadow-sm dark:border-primary/25 dark:bg-background/80">
            <Filter className="size-4" />
          </span>
          <div>
            <h2 className="font-semibold">Sort and Filter</h2>
            <p className="text-xs text-muted-foreground">Refine repository results</p>
          </div>
        </div>
        <Button
          aria-label="Reset filters"
          onClick={onReset}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <RotateCcw className="size-4" />
        </Button>
      </div>

      <div className="space-y-8">
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

        <div className="space-y-5 border-t border-[#E9C8F2]/70 pt-7 dark:border-border">
          <TagInput
            label="Include tags"
            onAddTag={(tag) => onAddTag("includeTags", tag)}
            placeholder="e.g. research"
          />
          <TagChips
            emptyLabel="No include tags added."
            onRemoveTag={(tag) => onRemoveTag("includeTags", tag)}
            tags={filters.includeTags}
          />
        </div>

        <div className="space-y-5 border-t border-[#E9C8F2]/70 pt-7 dark:border-border">
          <TagInput
            label="Exclude tags"
            onAddTag={(tag) => onAddTag("excludeTags", tag)}
            placeholder="e.g. archive"
          />
          <TagChips
            emptyLabel="No exclude tags added."
            onRemoveTag={(tag) => onRemoveTag("excludeTags", tag)}
            tags={filters.excludeTags}
          />
        </div>

        <Button
          className="mt-2 w-full border-[#E9C8F2] bg-white hover:bg-primary-soft dark:border-border dark:bg-background/80"
          onClick={onReset}
          type="button"
          variant="outline"
        >
          Reset Filters
        </Button>
      </div>
    </aside>
  )
}

export default RepositoryFilterPanel
