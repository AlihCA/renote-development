import { Link } from "react-router"
import { BookOpen, Eye, Quote, Star } from "lucide-react"
import { toast } from "sonner"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"
import { formatCount } from "@/lib/utils"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RepositoryStat({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
      <Icon className="size-3.5 text-primary/75" />
      <span className="font-medium text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  )
}

function PublicRepositoryCard({ fileTypes = [], repository }) {
  function handleSaveClick() {
    toast("Sign in to save repositories.")
  }

  return (
    <article className="rounded-lg border border-[#E9C8F2]/80 bg-white p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-card dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="min-w-0 text-lg font-semibold tracking-tight transition hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25"
              to={`/app/repositories/${repository.id}`}
            >
              {repository.title}
            </Link>
            <TrustBadge level={repository.trustLabel}>
              {toLabel(repository.trustLabel)}
            </TrustBadge>
            <VisibilityBadge visibility={repository.visibility} />
          </div>

          <p className="line-clamp-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            {repository.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {repository.tags.slice(0, 4).map((tag) => (
              <Badge
                className="rounded-lg border-[#E9C8F2] bg-[#FCF7FF] px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <RepositoryStat
              icon={BookOpen}
              label="Category"
              value={repository.subject}
            />
            <RepositoryStat
              icon={Eye}
              label="Views"
              value={formatCount(repository.views)}
            />
            <RepositoryStat
              icon={Quote}
              label="Citations"
              value={formatCount(repository.citationCount)}
            />
          </div>
        </div>

        <button
          aria-label="Save repository"
          className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#E9C8F2] bg-white/80 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary-soft hover:text-primary dark:border-primary/20 dark:bg-background/80"
          onClick={handleSaveClick}
          type="button"
        >
          <Star className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[#E9C8F2]/70 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-border">
        <div className="flex items-center gap-2">
          {fileTypes.slice(0, 4).map((fileType) => (
            <FileTypeIcon
              className="size-7 rounded-lg shadow-none"
              extension={fileType}
              key={fileType}
              size="sm"
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Updated {formatDate(repository.updatedAt)}
        </p>
      </div>
    </article>
  )
}

export default PublicRepositoryCard
