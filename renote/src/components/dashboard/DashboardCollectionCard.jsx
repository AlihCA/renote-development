import { Link } from "react-router"
import { ArrowUpRight, BookmarkCheck, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function DashboardCollectionCard({ collection }) {
  return (
    <article className="renote-card flex h-full flex-col gap-4 p-4">
      <div className="flex items-start gap-3">
        <span className="renote-icon-container">
          <Layers className="size-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            className="font-semibold tracking-tight transition hover:text-primary"
            to={`/app/collections/${collection.id}`}
          >
            {collection.title}
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {collection.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {collection.previewTags.slice(0, 3).map((tag) => (
          <Badge className="rounded-xl" key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t pt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <BookmarkCheck className="size-4 text-primary/75" />
            <span className="font-semibold text-foreground">
              {collection.savedCount}
            </span>
            saved
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(collection.updatedAt)}
          </span>
        </div>

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

export default DashboardCollectionCard
