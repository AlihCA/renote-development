import {
  Archive,
  Info,
  MoreHorizontal,
  Share2,
  Upload,
} from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import NewFolderDialog from "@/components/workspace/NewFolderDialog"
import UploadFileDialog from "@/components/workspace/UploadFileDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

function RepositoryHeader({
  folders,
  onCreateFolder,
  onOpenDetails,
  onUploadFile,
  repository,
}) {
  return (
    <section className="renote-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-3">
          <nav
            aria-label="Repository breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            <Link className="transition hover:text-primary" to="/app/my-repositories">
              My Repositories
            </Link>
            <span>/</span>
            <span className="truncate text-foreground/75">{repository.title}</span>
          </nav>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
                {repository.title}
              </h1>
              <TrustBadge level={repository.trustLabel}>
                {toLabel(repository.trustLabel)}
              </TrustBadge>
              <VisibilityBadge visibility={repository.visibility} />
            </div>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
              {repository.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {repository.tags.map((tag) => (
              <Badge className="rounded-xl" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground">
              Updated {formatDate(repository.updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <UploadFileDialog folders={folders} onUploadFile={onUploadFile}>
            <Button size="sm">
              <Upload className="size-4" />
              Upload File
            </Button>
          </UploadFileDialog>
          <NewFolderDialog folders={folders} onCreateFolder={onCreateFolder} />
          <Button
            onClick={() => toast("Share options will be connected later.")}
            size="sm"
            type="button"
            variant="outline"
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <Button onClick={onOpenDetails} size="sm" type="button" variant="outline">
            <Info className="size-4" />
            Details
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="More repository actions"
                size="icon-sm"
                variant="outline"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Repository actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => toast("Repository details editing is prototype-only.")}
              >
                Edit details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast("Workspace export will be connected later.")}
              >
                Export outline
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => toast("Archive is a prototype action.")}
              >
                <Archive className="size-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  )
}

export default RepositoryHeader
