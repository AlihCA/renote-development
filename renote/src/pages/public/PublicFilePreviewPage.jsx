import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Download,
  FileQuestion,
  LockKeyhole,
  Save,
  Sparkles,
} from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockFiles, mockRepositories } from "@/data"

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toLabel(value) {
  return String(value ?? "")
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function stripExtension(fileName) {
  return String(fileName ?? "Untitled file").replace(/\.[^/.]+$/, "")
}

function getFileMetric(file) {
  const kind = String(file.extension ?? file.type ?? "file").toLowerCase()

  if (["pdf", "doc", "docx"].includes(kind)) {
    return `${file.pageCount ?? file.pages ?? 1} pages`
  }

  if (["ppt", "pptx"].includes(kind)) {
    return `${file.slideCount ?? file.slides ?? 28} slides`
  }

  if (["xls", "xlsx"].includes(kind)) {
    return `${file.sheetCount ?? file.sheets ?? 4} sheets`
  }

  return "Read-only preview"
}

function MockPublicDocument({ file }) {
  const title = stripExtension(file.name)

  return (
    <div className="rounded-lg border border-[#E9C8F2]/80 bg-[#F8F0FC] p-4 dark:border-primary/20 dark:bg-primary/5">
      <div className="mx-auto aspect-[8.5/11] w-full max-w-3xl rounded-lg border border-[#E9C8F2] bg-white p-6 shadow-sm dark:border-border dark:bg-background sm:p-8">
        <div className="space-y-5">
          <div className="space-y-2 border-b border-[#E9C8F2]/70 pb-5 dark:border-border">
            <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
              Public read-only preview
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              This public preview uses mock extracted content. Full document
              rendering will be connected during backend integration.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-3/4 rounded-full bg-[#E9C8F2]/70" />
            <div className="h-3 w-full rounded-full bg-[#E9C8F2]/55" />
            <div className="h-3 w-11/12 rounded-full bg-[#E9C8F2]/55" />
            <div className="h-3 w-5/6 rounded-full bg-[#E9C8F2]/55" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Section
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Academic context, notes, and reviewer cues are represented here
                for the prototype demo.
              </p>
            </div>
            <div className="rounded-lg border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Details
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {getFileMetric(file)} / {file.size} / Updated{" "}
                {formatDate(file.updatedAt ?? file.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-[#E9C8F2]/70 p-4 dark:border-border">
            <div className="h-2.5 w-full rounded-full bg-muted" />
            <div className="h-2.5 w-10/12 rounded-full bg-muted" />
            <div className="h-2.5 w-8/12 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PublicFileActions() {
  return (
    <aside className="renote-card h-fit space-y-4 p-5 lg:sticky lg:top-24">
      <div className="space-y-3">
        <span className="grid size-10 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight">AI Summary</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sign in to use AI Summary for this file.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/sign-in">Sign in to use AI Summary</Link>
        </Button>
      </div>

      <div className="border-t border-[#E9C8F2]/70 pt-4 dark:border-border">
        <div className="space-y-2">
          <h2 className="font-semibold tracking-tight">Save Resource</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in to save this resource to a collection or study board.
          </p>
        </div>
        <Button asChild className="mt-3 w-full" variant="outline">
          <Link to="/sign-in">
            <Save className="size-4" />
            Sign in to save this resource
          </Link>
        </Button>
      </div>

      <Button asChild className="w-full" variant="outline">
        <Link to="/sign-in">
          <Download className="size-4" />
          Sign in to download
        </Link>
      </Button>
    </aside>
  )
}

function PublicFilePreviewPage() {
  const { fileId } = useParams()
  const file = mockFiles.find((item) => item.id === fileId)
  const repository = file
    ? mockRepositories.find((item) => item.id === file.repositoryId)
    : null

  if (!file || !repository) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/explore-public">Back to Explore</Link>
            </Button>
          }
          description="This public file preview could not be found."
          icon={FileQuestion}
          title="File not found"
        />
      </PageShell>
    )
  }

  if (repository.visibility !== "public") {
    return (
      <PageShell className="pt-10 sm:pt-12">
        <EmptyState
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to="/sign-in">Sign in to request access</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/explore-public">Back to Explore</Link>
              </Button>
            </div>
          }
          description="This file belongs to a restricted repository. Sign in or request access before viewing its contents."
          icon={LockKeyhole}
          title="Restricted file"
        />
      </PageShell>
    )
  }

  return (
    <PageShell className="max-w-[1400px] space-y-5 py-8" size="wide">
      <Button asChild className="w-fit" size="sm" variant="ghost">
        <Link to={`/repositories/${repository.id}`}>
          <ArrowLeft className="size-4" />
          Back to Repository
        </Link>
      </Button>

      <section className="renote-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <FileTypeIcon extension={file.extension} size="lg" type={file.type} />
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
                  Public file preview
                </Badge>
                <TrustBadge level={repository.trustLabel}>
                  {toLabel(repository.trustLabel)}
                </TrustBadge>
                <VisibilityBadge visibility={repository.visibility} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {file.name}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Read-only public file preview from {repository.title}. Sign in
                  to save resources, generate AI summaries, or request protected
                  materials.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#E9C8F2]/70 bg-[#FCF7FF] px-2.5 py-1 dark:border-primary/20 dark:bg-primary/5">
                  <BookOpen className="size-3.5 text-primary" />
                  {toLabel(file.extension ?? file.type)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#E9C8F2]/70 bg-[#FCF7FF] px-2.5 py-1 dark:border-primary/20 dark:bg-primary/5">
                  <CalendarDays className="size-3.5 text-primary" />
                  Updated {formatDate(file.updatedAt ?? file.uploadedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0">
          <MockPublicDocument file={file} />
        </main>

        <PublicFileActions />
      </div>
    </PageShell>
  )
}

export default PublicFilePreviewPage
