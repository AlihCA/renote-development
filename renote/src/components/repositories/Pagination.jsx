import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function getVisiblePages(currentPage, totalPages) {
  const pages = []

  for (let page = 1; page <= totalPages; page += 1) {
    if (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    ) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return pages
}

function Pagination({ currentPage, onPageChange, totalPages }) {
  if (totalPages <= 1) {
    return null
  }

  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages

  return (
    <nav
      aria-label="Repository results pagination"
      className="flex items-center justify-between gap-3"
    >
      <Button
        disabled={!canGoBack}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
        variant="outline"
      >
        <ChevronLeft className="size-4" />
        Prev
      </Button>

      <div className="hidden items-center gap-1 sm:flex">
        {getVisiblePages(currentPage, totalPages).map((page, index) =>
          page === "..." ? (
            <span
              className="grid size-9 place-items-center text-sm text-muted-foreground"
              key={`ellipsis-${index}`}
            >
              ...
            </span>
          ) : (
            <Button
              className={cn(
                "size-9 rounded-2xl px-0",
                page === currentPage &&
                  "bg-primary text-primary-foreground hover:bg-[var(--renote-primary-hover)]"
              )}
              key={page}
              onClick={() => onPageChange(page)}
              type="button"
              variant={page === currentPage ? "default" : "ghost"}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <div className="text-sm font-medium text-muted-foreground sm:hidden">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        disabled={!canGoForward}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
        variant="outline"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

export default Pagination
