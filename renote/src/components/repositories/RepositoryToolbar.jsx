import { LayoutGrid, List, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function RepositoryToolbar({
  filters,
  onFilterChange,
  onViewChange,
  resultCount,
  view,
}) {
  return (
    <section className="space-y-3">
      <div className="w-full">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search repositories</span>
          <div className="renote-input-shell">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              onChange={(event) => onFilterChange("query", event.target.value)}
              placeholder="Search repositories"
              type="search"
              value={filters.query}
            />
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} repositories from your prototype workspace.
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
              <SelectItem value="saved">Saved</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="views">Most viewed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-2xl border bg-background/80 p-1">
            <Button
              aria-label="Grid view"
              onClick={() => onViewChange("grid")}
              size="icon-sm"
              type="button"
              variant={view === "grid" ? "secondary" : "ghost"}
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

export default RepositoryToolbar
