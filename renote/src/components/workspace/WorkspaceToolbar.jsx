import { ArrowUpDown, Filter, Grid2X2, List, Search, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

function WorkspaceToolbar({
  className,
  onOpenAi,
  query,
  setQuery,
  setSortBy,
  setViewMode,
  sortBy,
  viewMode,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="renote-input-shell h-10 w-full lg:max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search files"
          type="search"
          value={query}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <Button
          onClick={() => toast("File filters will be connected later.")}
          size="sm"
          type="button"
          variant="outline"
        >
          <Filter className="size-4" />
          Filter
        </Button>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-full border-border bg-background/90 sm:w-44">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        <div className="inline-flex w-fit rounded-2xl border border-border bg-background/80 p-1">
          <Button
            aria-label="List view"
            className={cn(viewMode === "list" && "bg-muted text-foreground")}
            onClick={() => setViewMode("list")}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            aria-label="Grid view"
            className={cn(viewMode === "grid" && "bg-muted text-foreground")}
            onClick={() => setViewMode("grid")}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Grid2X2 className="size-3.5" />
          </Button>
        </div>

        <Button onClick={onOpenAi} size="sm" type="button">
          <Sparkles className="size-4" />
          AI Summary
        </Button>
      </div>
    </div>
  )
}

export default WorkspaceToolbar
