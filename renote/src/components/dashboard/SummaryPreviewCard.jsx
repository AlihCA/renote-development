import { Link } from "react-router"
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function SummaryPreviewCard({ summary }) {
  return (
    <article className="rounded-3xl border bg-background/75 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="renote-icon-container size-10">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-tight">{summary.title}</h3>
            <Badge className="rounded-xl" variant="outline">
              {summary.mode}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{summary.fileName}</p>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {summary.preview}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="size-4 text-primary/75" />
          Generated {formatDate(summary.generatedAt)}
        </span>
        <Button asChild size="sm" variant="outline">
          <Link to={`/app/summaries/${summary.id}`}>
            View summary
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default SummaryPreviewCard
