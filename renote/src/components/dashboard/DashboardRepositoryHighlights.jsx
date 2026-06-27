import { Link } from "react-router"
import { ArrowUpRight, BookOpen, Eye, Quote } from "lucide-react"

import TrustBadge from "@/components/common/TrustBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCount } from "@/lib/utils"

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function TrendingRepositoryRow({ repository }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Link
            className="font-semibold tracking-tight transition hover:text-primary"
            to={`/app/workspace/${repository.id}`}
          >
            {repository.title}
          </Link>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary/75" />
              {repository.subject}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4 text-primary/75" />
              <span className="font-semibold text-foreground">
                {formatCount(repository.views)}
              </span>
              views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Quote className="size-4 text-primary/75" />
              <span className="font-semibold text-foreground">
                {formatCount(repository.citationCount)}
              </span>
              citations
            </span>
          </div>
        </div>

        <TrustBadge className="w-fit shrink-0" level={repository.trustLabel}>
          {toLabel(repository.trustLabel)}
        </TrustBadge>
      </div>
    </article>
  )
}

function RecommendedRepositoryRow({ reason, repository }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="font-semibold tracking-tight transition hover:text-primary"
              to={`/app/workspace/${repository.id}`}
            >
              {repository.title}
            </Link>
            <Badge className="rounded-xl border-primary/15 bg-primary/10 text-primary shadow-none">
              {reason}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {repository.tags.slice(0, 3).map((tag) => (
              <Badge className="rounded-xl" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button asChild className="w-fit" size="xs" variant="outline">
          <Link to={`/app/workspace/${repository.id}`}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

export { RecommendedRepositoryRow, TrendingRepositoryRow }
