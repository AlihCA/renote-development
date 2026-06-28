import { BookOpen, Star } from "lucide-react"

import { cn, formatCount } from "@/lib/utils"
import { getRepositoryCardMetrics } from "@/utils/repositoryMetrics"

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

function RepositoryMetricsRow({ className, repository, showCategory = true }) {
  const metrics = getRepositoryCardMetrics(repository)
  const ratingLabel =
    metrics.reviewCount > 0 ? metrics.averageRating.toFixed(1) : "No rating"
  const metricItems = [
    showCategory
      ? {
          icon: BookOpen,
          label: metrics.category,
          value: metrics.category,
        }
      : null,
    {
      icon: Star,
      label: `${ratingLabel} from ${formatCount(metrics.reviewCount)} ${pluralize(
        metrics.reviewCount,
        "review"
      )}`,
      value: (
        <>
          <span className="font-medium text-foreground">{ratingLabel}</span>{" "}
          <span>
            ({formatCount(metrics.reviewCount)}{" "}
            {pluralize(metrics.reviewCount, "review")})
          </span>
        </>
      ),
    },
    {
      label: `${formatCount(metrics.saveCount)} ${pluralize(
        metrics.saveCount,
        "save"
      )}`,
      value: (
        <>
          <span className="font-medium text-foreground">
            {formatCount(metrics.saveCount)}
          </span>{" "}
          <span>{pluralize(metrics.saveCount, "save")}</span>
        </>
      ),
    },
    {
      label: `${formatCount(metrics.views)} views`,
      value: (
        <>
          <span className="font-medium text-foreground">
            {formatCount(metrics.views)}
          </span>{" "}
          <span>views</span>
        </>
      ),
    },
    {
      label: `${formatCount(metrics.citationCount)} ${pluralize(
        metrics.citationCount,
        "citation"
      )}`,
      value: (
        <>
          <span className="font-medium text-foreground">
            {formatCount(metrics.citationCount)}
          </span>{" "}
          <span>{pluralize(metrics.citationCount, "citation")}</span>
        </>
      ),
    },
  ].filter(Boolean)

  return (
    <div
      aria-label={`Repository metrics for ${repository.title}`}
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-2 text-xs leading-5 text-muted-foreground sm:text-sm",
        className
      )}
    >
      {metricItems.map((item, index) => {
        const Icon = item.icon

        return (
          <span
            aria-label={item.label}
            className="inline-flex max-w-full items-center gap-1.5"
            key={item.label}
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="mr-0.5 text-muted-foreground/55"
              >
                &middot;
              </span>
            ) : null}
            {Icon ? <Icon className="size-3.5 shrink-0 text-primary/75" /> : null}
            <span className="min-w-0">{item.value}</span>
          </span>
        )
      })}
    </div>
  )
}

export default RepositoryMetricsRow
