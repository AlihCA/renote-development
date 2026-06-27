import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  FileQuestion,
  MoreHorizontal,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import FileTypeIcon from "@/components/files/FileTypeIcon"
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
import { mockFiles, mockRepositories, mockSummaries } from "@/data"

const reviewNotice =
  "AI-generated summaries are intended for review assistance only. Users should verify summaries with the original file before using them for academic work."

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getSummarySource(summary) {
  const file = mockFiles.find((item) => item.id === summary.fileId)
  const repository =
    mockRepositories.find((item) => item.id === summary.repositoryId) ??
    mockRepositories.find((item) => item.id === file?.repositoryId)

  return {
    file,
    fileName: file?.name ?? summary.fileName ?? "Unknown source",
    repository,
    repositoryTitle:
      repository?.title ?? summary.repositoryTitle ?? "Repository source unavailable",
  }
}

function getFullSummaryText(summary) {
  const content = summary.content ?? {}
  const sections = [
    summary.title,
    summary.preview,
    content.overview,
    ...(content.importantConcepts ?? []),
    ...(content.definitions ?? []),
    ...(content.reviewNotes ?? []),
    ...(content.suggestedQuestions ?? []),
  ]

  return sections.filter(Boolean).join("\n")
}

async function copySummary(summary) {
  try {
    await globalThis.navigator?.clipboard?.writeText(getFullSummaryText(summary))
    toast("Summary copied.")
  } catch {
    toast("Summary copied.")
  }
}

function SummaryTypeBadge({ mode }) {
  return (
    <Badge className="rounded-lg bg-primary/10 text-primary" variant="secondary">
      {mode}
    </Badge>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{value}</dd>
    </div>
  )
}

function ContentSection({ items, title }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm dark:border-primary/20 dark:bg-card">
      <h2 className="font-semibold tracking-tight">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li className="flex gap-2 text-sm leading-6 text-muted-foreground" key={item}>
            <Sparkles className="mt-1 size-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SourceDetails({ source, summary }) {
  return (
    <aside className="renote-card h-fit space-y-4 p-4 lg:sticky lg:top-24">
      <div>
        <h2 className="font-semibold tracking-tight">Source details</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Metadata used for this saved summary.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 dark:border-primary/20 dark:bg-primary/5">
        {source.file ? (
          <FileTypeIcon extension={source.file.extension ?? source.file.type} size="sm" />
        ) : (
          <span className="inline-grid size-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <FileQuestion className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{source.fileName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {source.repositoryTitle}
          </p>
        </div>
      </div>

      <dl className="space-y-3">
        <DetailRow label="Source file" value={source.fileName} />
        <DetailRow label="Repository" value={source.repositoryTitle} />
        <DetailRow
          label="Type"
          value={
            source.file?.extension?.toUpperCase() ??
            source.file?.type?.toUpperCase() ??
            "Summary"
          }
        />
        <DetailRow label="Generated" value={formatDate(summary.generatedAt)} />
        <DetailRow label="Summary mode" value={summary.mode} />
      </dl>

      <p className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 text-xs leading-5 text-muted-foreground dark:border-primary/20 dark:bg-primary/5">
        {reviewNotice}
      </p>
    </aside>
  )
}

function SummaryDetailsPage() {
  const { summaryId } = useParams()
  const summary = mockSummaries.find((item) => item.id === summaryId)

  if (!summary) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/app/summaries">Back to AI Summary History</Link>
            </Button>
          }
          description="This prototype summary could not be found."
          icon={FileQuestion}
          title="Summary not found"
        />
      </PageShell>
    )
  }

  const source = getSummarySource(summary)
  const content = summary.content ?? {}

  return (
    <PageShell className="space-y-7">
      <Button asChild className="w-fit" variant="ghost">
        <Link to="/app/summaries">
          <ArrowLeft className="size-4" />
          Back to AI Summary History
        </Link>
      </Button>

      <section className="renote-card space-y-5 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="inline-grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {summary.title}
                </h1>
                <SummaryTypeBadge mode={summary.mode} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{source.fileName}</span>
                <span>{source.repositoryTitle}</span>
                <span>Generated {formatDate(summary.generatedAt)}</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {summary.preview}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => copySummary(summary)} type="button" variant="outline">
              <Copy className="size-4" />
              Copy Summary
            </Button>
            {source.file ? (
              <Button asChild variant="outline">
                <Link to={`/app/files/${source.file.id}`}>
                  Open Source File
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="More summary actions" size="icon-sm" variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Summary actions</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => toast("Share summary will be connected later.")}>
                  Share summary
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toast("Regenerate summary will be connected later.")}>
                  Regenerate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => toast("Archive summary will be connected later.")}
                  variant="destructive"
                >
                  Archive summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-4">
          {content.overview ? (
            <section className="rounded-lg border border-[#E9C8F2]/80 bg-white p-4 shadow-sm dark:border-primary/20 dark:bg-card">
              <h2 className="font-semibold tracking-tight">Quick Summary</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {content.overview}
              </p>
            </section>
          ) : null}

          <ContentSection
            items={content.importantConcepts}
            title="Important Concepts"
          />
          <ContentSection items={content.definitions} title="Definitions" />
          <ContentSection items={content.reviewNotes} title="Review Notes" />
          <ContentSection
            items={content.suggestedQuestions}
            title="Suggested Questions"
          />
        </main>

        <SourceDetails source={source} summary={summary} />
      </div>
    </PageShell>
  )
}

export default SummaryDetailsPage
