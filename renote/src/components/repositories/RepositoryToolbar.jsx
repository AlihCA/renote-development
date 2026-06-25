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
    <section className="renote-card space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search repositories</span>
          <div className="renote-input-shell">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              onChange={(event) => onFilterChange("query", event.target.value)}
              placeholder="Search title, description, subject, or tag"
              type="search"
              value={filters.query}
            />
          </div>
        </label>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
          <Select
            onValueChange={(value) => onFilterChange("visibility", value)}
            value={filters.visibility}
          >
            <SelectTrigger className="w-full border-border bg-background/80">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => onFilterChange("trust", value)}
            value={filters.trust}
          >
            <SelectTrigger className="w-full border-border bg-background/80">
              <SelectValue placeholder="Trust label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trust labels</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="official">Official</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => onFilterChange("sort", value)}
            value={filters.sort}
          >
            <SelectTrigger className="w-full border-border bg-background/80">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="views">Most viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      <p className="text-sm text-muted-foreground">
        Showing {resultCount} repositories from your prototype workspace.
      </p>
    </section>
  )
}

export default RepositoryToolbar
