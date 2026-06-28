import { Bookmark, BookOpen, Eye, Quote, Star } from "lucide-react"

import { cn, formatCount } from "@/lib/utils"
import { getRepositoryCardMetrics } from "@/utils/repositoryMetrics"

function MetricItem({ children, icon: Icon }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5">
      <Icon className="size-3.5 shrink-0 text-primary/75" />
      <span className="min-w-0">{children}</span>
    </span>
  )
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

function RepositoryMetricsRow({ className, repository }) {
  const metrics = getRepositoryCardMetrics(repository)
  const ratingLabel =
    metrics.reviewCount > 0 ? metrics.averageRating.toFixed(1) : "No rating"

  return (
    <div
      aria-label={`Repository metrics for ${repository.title}`}
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs leading-5 text-muted-foreground sm:text-sm",
        className
      )}
    >
      <MetricItem icon={BookOpen}>
        <span className="font-medium text-foreground">{metrics.category}</span>
      </MetricItem>
      <MetricItem icon={Star}>
        <span className="font-medium text-foreground">{ratingLabel}</span>{" "}
        <span>
          ({formatCount(metrics.reviewCount)}{" "}
          {pluralize(metrics.reviewCount, "review")})
        </span>
      </MetricItem>
      <MetricItem icon={Bookmark}>
        <span className="font-medium text-foreground">
          {formatCount(metrics.saveCount)}
        </span>{" "}
        <span>{pluralize(metrics.saveCount, "save")}</span>
      </MetricItem>
      <MetricItem icon={Eye}>
        <span className="font-medium text-foreground">
          {formatCount(metrics.views)}
        </span>{" "}
        <span>views</span>
      </MetricItem>
      <MetricItem icon={Quote}>
        <span className="font-medium text-foreground">
          {formatCount(metrics.citationCount)}
        </span>{" "}
        <span>{pluralize(metrics.citationCount, "citation")}</span>
      </MetricItem>
    </div>
  )
}

export default RepositoryMetricsRow
