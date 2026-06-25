import { Link } from "react-router"
import { BookOpen, Eye, Heart, MessageCircle, Star } from "lucide-react"
import { toast } from "sonner"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value)
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RepositoryStat({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 text-primary/75" />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  )
}

function getLikeCount(repository) {
  return Math.max(8, Math.round(repository.views / 32))
}

function getCommentCount(repository) {
  return Math.max(2, repository.folderCount + repository.summaryCount)
}

function PublicRepositoryCard({ fileTypes = [], repository }) {
  function handleSaveClick() {
    toast("Sign in to save repositories.")
  }

  return (
    <article className="renote-card group space-y-4 p-5 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] hover:shadow-md dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            className="text-xl font-semibold tracking-tight transition hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25"
            to={`/app/repositories/${repository.id}`}
          >
            {repository.title}
          </Link>
        </div>

        <button
          aria-label="Sign in to save repository"
          className="grid size-9 shrink-0 place-items-center rounded-2xl border border-border/80 bg-background/75 text-muted-foreground transition hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
          onClick={handleSaveClick}
          type="button"
        >
          <Star className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <TrustBadge level={repository.trustLabel}>
          {toLabel(repository.trustLabel)}
        </TrustBadge>
        <VisibilityBadge visibility={repository.visibility} />
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {repository.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {repository.tags.slice(0, 4).map((tag) => (
          <Badge className="rounded-xl" key={tag} variant="outline">
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
          icon={Heart}
          label="Likes"
          value={getLikeCount(repository)}
        />
        <RepositoryStat
          icon={MessageCircle}
          label="Comments"
          value={getCommentCount(repository)}
        />
        <RepositoryStat
          icon={Eye}
          label="Views"
          value={formatNumber(repository.views)}
        />
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Resource types</p>
          <div className="flex items-center gap-2">
            {fileTypes.slice(0, 4).map((fileType) => (
              <FileTypeIcon
                className="size-5 rounded-none border-0 bg-transparent shadow-none dark:bg-transparent"
                extension={fileType}
                key={fileType}
                size="sm"
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Updated {formatDate(repository.updatedAt)}
        </p>
      </div>
    </article>
  )
}

export default PublicRepositoryCard
