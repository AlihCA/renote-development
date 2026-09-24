import { Link } from "react-router"
import { BookOpen } from "lucide-react"

import { Badge } from "@/components/ui/badge"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function RepositoryHeader({ repository }) {
  return (
    <section className="renote-card space-y-4 p-4 sm:p-5">
      <nav
        aria-label="Material location"
        className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
      >
        <Link className="transition hover:text-primary" to="/app/courses">
          My Courses
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{repository.title}</span>
      </nav>

      <div className="flex items-start gap-3">
        <span className="renote-icon-container">
          <BookOpen className="size-5" />
        </span>
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{repository.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">{repository.subject}</Badge>
            <span>Updated {formatDate(repository.updatedAt)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RepositoryHeader
