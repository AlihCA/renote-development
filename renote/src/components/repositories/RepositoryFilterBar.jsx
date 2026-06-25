import { Search } from "lucide-react"

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
    <label className="min-w-0 space-y-1.5">
      <span className="px-1 text-xs font-medium text-muted-foreground">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full bg-background/80 sm:w-44">
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

function RepositoryFilterBar({
  filters,
  fileTypeOptions,
  onFilterChange,
  subjectOptions,
  trustOptions,
}) {
  return (
    <div className="renote-card p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label className="min-w-0 space-y-1.5">
          <span className="px-1 text-xs font-medium text-muted-foreground">
            Search resources
          </span>
          <div className="renote-input-shell">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              onChange={(event) => onFilterChange("query", event.target.value)}
              placeholder="Search by title, tag, subject, or owner"
              type="search"
              value={filters.query}
            />
          </div>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="Subject"
            onChange={(value) => onFilterChange("subject", value)}
            options={subjectOptions}
            value={filters.subject}
          />
          <FilterSelect
            label="File type"
            onChange={(value) => onFilterChange("fileType", value)}
            options={fileTypeOptions}
            value={filters.fileType}
          />
          <FilterSelect
            label="Trust label"
            onChange={(value) => onFilterChange("trust", value)}
            options={trustOptions}
            value={filters.trust}
          />
          <FilterSelect
            label="Sort"
            onChange={(value) => onFilterChange("sort", value)}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Most viewed", value: "views" },
              { label: "A-Z", value: "az" },
            ]}
            value={filters.sort}
          />
        </div>
      </div>
    </div>
  )
}

export default RepositoryFilterBar
