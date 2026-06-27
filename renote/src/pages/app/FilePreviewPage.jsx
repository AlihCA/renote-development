import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileQuestion,
  Info,
  Maximize2,
  Minus,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Plus,
  Quote,
  RefreshCw,
  Send,
  Sparkles,
  ShieldCheck,
  Tag,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockFiles, mockFolders, mockRepositories, mockSummaries } from "@/data"
import { cn } from "@/lib/utils"

const summaryTypes = ["Quick", "Detailed", "Key Points", "Study Guide"]
const citationFormats = ["APA", "MLA", "Chicago"]
const suggestedQuestions = [
  "What is the main idea?",
  "Summarize the key points",
  "Explain this for review",
  "Generate study notes",
]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function toTitleCase(value) {
  return String(value ?? "")
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function stripExtension(fileName) {
  return String(fileName ?? "Untitled file").replace(/\.[^/.]+$/, "")
}

function getFileKind(file) {
  return String(file?.extension ?? file?.type ?? "file").toLowerCase()
}

function getFileTypeLabel(file) {
  const kind = getFileKind(file)

  if (kind === "pdf") return "PDF"
  if (["doc", "docx"].includes(kind)) return "Document"
  if (["ppt", "pptx"].includes(kind)) return "Presentation"
  if (["xls", "xlsx"].includes(kind)) return "Spreadsheet"
  if (["png", "jpg", "jpeg", "image"].includes(kind)) return "Image"
  if (["url", "link"].includes(kind)) return "External link"

  return toTitleCase(kind)
}

function toPositiveInteger(value) {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return null
  }

  return Math.floor(parsedValue)
}

function getFilePageCount(file) {
  return toPositiveInteger(file?.pages ?? file?.pageCount) ?? 1
}

function clampPage(page, totalPages) {
  const maxPage = Math.max(1, totalPages)
  const parsedPage = toPositiveInteger(page) ?? 1

  return Math.min(maxPage, Math.max(1, parsedPage))
}

function getFileMetric(file) {
  const kind = getFileKind(file)

  if (kind === "pdf") return { label: "Pages", value: getFilePageCount(file) }
  if (["ppt", "pptx"].includes(kind)) {
    return { label: "Slides", value: toPositiveInteger(file?.slides ?? file?.slideCount) ?? 28 }
  }
  if (["xls", "xlsx"].includes(kind)) {
    return { label: "Sheets", value: toPositiveInteger(file?.sheets ?? file?.sheetCount) ?? 4 }
  }
  if (["doc", "docx"].includes(kind)) return { label: "Pages", value: getFilePageCount(file) }

  return null
}

const academicPageTemplates = [
  {
    title: "Introduction",
    heading: "Purpose and scope",
    body:
      "This section frames the document as a guide for evaluating capstone submissions, with attention to evidence quality, research fit, and academic presentation.",
    bullets: [
      "Clarify the review context before scoring begins.",
      "Identify the deliverables expected from each student team.",
      "Connect rubric language to observable project evidence.",
    ],
    blockTitle: "Opening review checklist",
  },
  {
    title: "Evaluation Criteria",
    heading: "Core assessment dimensions",
    body:
      "The rubric groups evaluation items by problem definition, implementation quality, documentation completeness, and defense readiness.",
    bullets: [
      "Technical implementation is reviewed with documented decisions.",
      "Research claims should be supported by cited sources.",
      "Usability evidence should be visible in the submitted materials.",
    ],
    blockTitle: "Criteria matrix",
  },
  {
    title: "Documentation Requirements",
    heading: "Required academic artifacts",
    body:
      "Teams are expected to provide complete chapters, traceable revisions, repository links, and presentation materials that support the final evaluation.",
    bullets: [
      "Chapter files should follow the current department template.",
      "Diagrams and tables need captions and source references.",
      "Appendices should include survey forms or testing evidence.",
    ],
    blockTitle: "Submission package",
  },
]

function getMockDocumentPage(file, pageNumber) {
  const fileTitle = stripExtension(file.name)

  if (pageNumber === 1) {
    return {
      body:
        "This prototype surface represents the first page of the uploaded document. Real PDF rendering will connect to storage later.",
      blockTitle: "Overview cards",
      bullets: [
        "Review citation metadata from the assistant panel.",
        "Navigate mock pages with the thumbnail rail or toolbar controls.",
        "Use the page preview as a placeholder for future PDF rendering.",
      ],
      heading: fileTitle,
      title: fileTitle,
      variant: "cover",
    }
  }

  const template = academicPageTemplates[pageNumber - 2]

  if (template) {
    return {
      ...template,
      variant: "academic",
    }
  }

  return {
    body:
      "Additional mock academic content represents later pages in the source file, including notes, evidence markers, and review observations for the capstone panel.",
    blockTitle: pageNumber % 2 === 0 ? "Figure placeholder" : "Review table",
    bullets: [
      "Mark unclear claims for follow-up during defense preparation.",
      "Compare the submitted artifact against the rubric indicators.",
      "Keep reviewer notes linked to the exact source page.",
    ],
    heading: pageNumber % 2 === 0 ? "Academic content" : "Reviewer observations",
    title: pageNumber % 2 === 0 ? "Academic Content" : "Review Notes",
    variant: "academic",
  }
}

function buildSourceUrl(file) {
  return `https://renote.local/app/files/${file.id}`
}

function buildCitationMetadata(file, repository) {
  const citation = file.citation ?? {}

  return {
    accessDate: citation.accessDate ?? "2026-06-27",
    author: citation.author ?? file.ownerName ?? repository?.ownerName ?? "ReNote User",
    organization:
      citation.organization ?? repository?.ownerName ?? "College of Computing Studies",
    repositoryTitle:
      citation.repositoryTitle ?? repository?.title ?? "ReNote Repository",
    sourceType: citation.sourceType ?? getFileTypeLabel(file),
    title: citation.title ?? stripExtension(file.name),
    url: citation.url ?? buildSourceUrl(file),
    year:
      citation.year ??
      new Date(file.updatedAt ?? file.uploadedAt ?? Date.now()).getFullYear(),
  }
}

function createCitation(format, metadata) {
  const author = metadata.author || metadata.organization || "Unknown author"
  const title = metadata.title || "Untitled"
  const year = metadata.year || "n.d."
  const sourceType = metadata.sourceType || "File"
  const url = metadata.url || "ReNote prototype source"

  if (format === "MLA") {
    return `${author}. "${title}." ReNote, ${year}, ${url}.`
  }

  if (format === "Chicago") {
    return `${author}. "${title}." ReNote. ${year}. ${url}.`
  }

  return `${author}. (${year}). ${title} [${sourceType}]. ReNote. ${url}`
}

function FileBreadcrumb({ file, folder, repository }) {
  return (
    <nav
      aria-label="File location"
      className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
    >
      <Link className="transition hover:text-primary" to="/app/my-repositories">
        My Repositories
      </Link>
      <span>/</span>
      <Link
        className="transition hover:text-primary"
        to={`/app/workspace/${repository.id}`}
      >
        {repository.title}
      </Link>
      {folder ? (
        <>
          <span>/</span>
          <span>{folder.name}</span>
        </>
      ) : null}
      <span>/</span>
      <span className="line-clamp-1 text-foreground">{file.name}</span>
    </nav>
  )
}

function FileHeader({ file, folder, repository }) {
  const metric = getFileMetric(file)

  return (
    <section className="renote-card space-y-4 p-4 sm:p-5">
      <FileBreadcrumb file={file} folder={folder} repository={repository} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <FileTypeIcon extension={file.extension} size="lg" type={file.type} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="line-clamp-2 text-xl font-semibold tracking-tight sm:text-2xl">
                {file.name}
              </h1>
              <Badge className="rounded-xl" variant="outline">
                {getFileTypeLabel(file)}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{file.size}</span>
              {metric ? (
                <span>
                  {metric.value} {metric.label.toLowerCase()}
                </span>
              ) : null}
              <span>Uploaded {formatDate(file.uploadedAt)}</span>
              <span>Updated {formatDate(file.updatedAt ?? file.uploadedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => toast("Rename will be connected later.")}
            size="sm"
            type="button"
            variant="outline"
          >
            <Pencil className="size-4" />
            Rename
          </Button>
          <Button
            onClick={() => toast("Download will be connected later.")}
            size="sm"
            type="button"
            variant="outline"
          >
            <Download className="size-4" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="More file actions" size="icon-sm" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>File actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => toast("Move file is a prototype action.")}>
                Move to folder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Share file is a prototype action.")}>
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Archive file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  )
}

function PageThumbnailRail({ currentPage, file, onPageChange, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <aside
      aria-label="Document pages"
      className="hidden w-28 shrink-0 border-r border-[#E9C8F2]/70 bg-white/75 p-3 md:flex md:max-h-[720px] md:flex-col md:overflow-y-auto dark:border-primary/20 dark:bg-background/60"
    >
      <p className="px-1 text-[11px] font-semibold uppercase text-muted-foreground">
        Pages
      </p>
      <div className="mt-3 space-y-3">
        {pages.map((pageNumber) => {
          const page = getMockDocumentPage(file, pageNumber)
          const isActive = pageNumber === currentPage

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to page ${pageNumber}`}
              className={cn(
                "group w-full rounded-2xl border p-2 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
                isActive
                  ? "border-primary/70 bg-primary/5 shadow-sm ring-2 ring-primary/25"
                  : "border-[#E9C8F2]/80 bg-white hover:border-primary/35 hover:bg-[#FCF7FF]"
              )}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              type="button"
            >
              <span className="block aspect-[3/4] rounded-lg border border-[#E9C8F2]/80 bg-white p-1.5 shadow-sm">
                <span className="block h-1.5 w-7 rounded-full bg-slate-300" />
                <span className="mt-2 block h-1 w-full rounded-full bg-slate-200" />
                <span className="mt-1 block h-1 w-4/5 rounded-full bg-slate-200" />
                <span className="mt-2 block h-7 rounded-md border border-[#E9C8F2]/70 bg-[#FCF7FF]" />
                <span className="mt-2 block h-1 w-11/12 rounded-full bg-slate-200" />
                <span className="mt-1 block h-1 w-2/3 rounded-full bg-slate-200" />
              </span>
              <span
                className={cn(
                  "mt-2 block text-center text-xs font-semibold",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                Page {pageNumber}
              </span>
              <span className="mt-0.5 block truncate text-center text-[10px] text-muted-foreground">
                {page.title}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function MockDocumentPage({ currentPage, file, zoom }) {
  const page = getMockDocumentPage(file, currentPage)

  return (
    <div
      className="mx-auto min-h-[500px] w-full max-w-[720px] rounded-sm bg-white p-6 text-slate-800 shadow-xl ring-1 ring-black/5 transition sm:p-8"
      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
    >
      {page.variant === "cover" ? (
        <>
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              ReNote academic preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{page.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{page.body}</p>
          </div>

          <div className="mt-8 space-y-5 text-sm leading-7">
            <p>
              The file preview area is designed for academic review, citation
              checking, and AI-assisted reading. Students can inspect the source,
              ask questions, and prepare summaries without leaving the file.
            </p>
            <div className="space-y-3" aria-hidden="true">
              <div className="h-3 w-11/12 rounded-full bg-slate-200" />
              <div className="h-3 w-full rounded-full bg-slate-200" />
              <div className="h-3 w-10/12 rounded-full bg-slate-200" />
              <div className="h-3 w-8/12 rounded-full bg-slate-200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Key idea
                </p>
                <p className="mt-2 text-sm">
                  Preview content is mocked while metadata, summaries, and
                  citation panels remain functional prototype views.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Review note
                </p>
                <p className="mt-2 text-sm">
                  Use the assistant panel to generate summaries and citation
                  formats from editable file metadata.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {stripExtension(file.name)}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{page.title}</h2>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
              Page {currentPage}
            </span>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-7">
            <section>
              <h3 className="text-base font-semibold text-slate-900">{page.heading}</h3>
              <p className="mt-3 text-slate-600">{page.body}</p>
            </section>

            <div className="space-y-3" aria-hidden="true">
              <div className="h-3 w-full rounded-full bg-slate-200" />
              <div className="h-3 w-11/12 rounded-full bg-slate-200" />
              <div className="h-3 w-10/12 rounded-full bg-slate-200" />
              <div className="h-3 w-8/12 rounded-full bg-slate-200" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {page.blockTitle}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["Evidence", "Alignment", "Notes"].map((item) => (
                  <div
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-2">
              {page.bullets.map((item) => (
                <li className="flex gap-2 text-slate-600" key={item}>
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function PdfPreview({ currentPage, file, onPageChange, totalPages }) {
  const [zoom, setZoom] = useState(100)
  const [isThumbnailRailOpen, setIsThumbnailRailOpen] = useState(true)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  function goToPage(pageNumber) {
    onPageChange(clampPage(pageNumber, totalPages))
  }

  return (
    <section className="renote-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#E9C8F2]/70 bg-[#FCF7FF] p-3 dark:border-border dark:bg-primary/5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Button
            aria-label={isThumbnailRailOpen ? "Hide page thumbnails" : "Show page thumbnails"}
            aria-pressed={isThumbnailRailOpen}
            className="hidden md:inline-flex"
            onClick={() => setIsThumbnailRailOpen((current) => !current)}
            size="icon-sm"
            type="button"
            variant={isThumbnailRailOpen ? "secondary" : "ghost"}
          >
            <PanelLeft className="size-4" />
          </Button>
          <Badge className="rounded-xl" variant="secondary">
            Page {currentPage} / {totalPages}
          </Badge>
          <Button
            aria-label="Previous page"
            disabled={!canGoPrevious}
            onClick={() => goToPage(currentPage - 1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label="Next page"
            disabled={!canGoNext}
            onClick={() => goToPage(currentPage + 1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-xl border border-[#E9C8F2]/70 bg-white px-3 py-2 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-background/60">
            {zoom}%
          </span>
          <Button
            aria-label="Zoom out"
            disabled={zoom <= 80}
            onClick={() => setZoom((current) => Math.max(80, current - 10))}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Minus className="size-4" />
          </Button>
          <Button
            aria-label="Zoom in"
            disabled={zoom >= 140}
            onClick={() => setZoom((current) => Math.min(140, current + 10))}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            aria-label="Download file"
            onClick={() => toast("Download will be connected later.")}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Download className="size-4" />
          </Button>
          <Button
            aria-label="Fullscreen preview"
            onClick={() => toast("Fullscreen preview will be connected later.")}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Maximize2 className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="More preview actions" size="icon-sm" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast("Print is a prototype action.")}>
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Version history is a prototype action.")}>
                Version history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex min-h-[560px] bg-[#F7F1FA] dark:bg-background/40">
        {isThumbnailRailOpen ? (
          <PageThumbnailRail
            currentPage={currentPage}
            file={file}
            onPageChange={goToPage}
            totalPages={totalPages}
          />
        ) : null}

        <div className="min-w-0 flex-1 overflow-auto p-4 sm:p-8">
          <MockDocumentPage currentPage={currentPage} file={file} zoom={zoom} />
        </div>
      </div>
    </section>
  )
}

function PlaceholderPreview({ file }) {
  const kind = getFileKind(file)

  if (["url", "link"].includes(kind) || file.type === "url" || file.type === "link") {
    return (
      <section className="renote-card p-6">
        <div className="grid min-h-[420px] place-items-center rounded-3xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-6 text-center dark:border-primary/20 dark:bg-primary/5">
          <div className="max-w-md">
            <FileTypeIcon className="mx-auto" extension={file.extension} size="lg" type={file.type} />
            <h2 className="mt-4 text-lg font-semibold">External Resource</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This link preview will open an external academic resource when
              live integrations are connected.
            </p>
            <Button className="mt-5" type="button" variant="outline">
              <ExternalLink className="size-4" />
              Open resource
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="renote-card p-6">
      <div className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-[#E9C8F2]/80 bg-[#FCF7FF] p-6 text-center dark:border-primary/20 dark:bg-primary/5">
        <div className="max-w-md">
          <FileTypeIcon className="mx-auto" extension={file.extension} size="lg" type={file.type} />
          <h2 className="mt-4 text-lg font-semibold">{getFileTypeLabel(file)} Preview</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Preview for this file type will be connected later.
          </p>
        </div>
      </div>
    </section>
  )
}

function FilePreviewPanel({ currentPage, file, onPageChange, totalPages }) {
  return getFileKind(file) === "pdf" ? (
    <PdfPreview
      currentPage={currentPage}
      file={file}
      onPageChange={onPageChange}
      totalPages={totalPages}
    />
  ) : (
    <PlaceholderPreview file={file} />
  )
}

function AskAiSection() {
  const [question, setQuestion] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    toast("AI file chat will be connected later.")
    setQuestion("")
  }

  return (
    <section className="renote-card space-y-4 p-4 sm:p-5">
      <div>
        <h2 className="font-semibold tracking-tight">Ask AI about this file</h2>
        <p className="text-sm text-muted-foreground">
          Ask a focused question about the source you are previewing.
        </p>
      </div>

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          className="h-11 bg-background"
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask anything about this file..."
          value={question}
        />
        <Button aria-label="Send question" size="icon" type="submit">
          <Send className="size-4" />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((item) => (
          <button
            className="rounded-full border border-[#E9C8F2]/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/35 hover:bg-primary/5 hover:text-primary dark:border-primary/20 dark:bg-background/40"
            key={item}
            onClick={() => setQuestion(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  )
}

function SummaryPanel({ file, summary }) {
  const [summaryType, setSummaryType] = useState("Quick")
  const keyPoints =
    summary?.content?.importantConcepts ??
    summary?.content?.reviewNotes ??
    ["Summary generation will be connected to AI later."]

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold tracking-tight">Quick Summary</h3>

            <span className="group relative inline-flex">
              <button
                aria-label="AI-generated summaries should be verified with the original file before academic use."
                className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                type="button"
              >
                <Info className="size-3.5" />
              </button>

              <span className="pointer-events-none absolute left-1/2 top-7 z-40 hidden w-64 -translate-x-1/2 rounded-2xl border border-[#E9C8F2] bg-background px-3 py-2 text-xs leading-5 text-muted-foreground shadow-lg group-hover:block group-focus-within:block dark:border-primary/25">
                AI-generated summary. Verify with the original file before academic use.
              </span>
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            {summary
              ? `Generated ${formatDate(summary.generatedAt)}`
              : "No saved summary yet"}
          </p>
        </div>

        <Button
          onClick={() => toast("New summary generation will be connected later.")}
          size="sm"
          type="button"
          variant="ghost"
        >
          <RefreshCw className="size-4" />
          Generate new
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Key points</p>
        <ul className="space-y-2">
          {keyPoints.slice(0, 4).map((point) => (
            <li className="flex gap-2 text-sm leading-6" key={point}>
              <Sparkles className="mt-1 size-3.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {summaryTypes.map((type) => (
          <button
            className={cn(
              "rounded-2xl border px-3 py-2 text-sm font-medium transition",
              summaryType === type
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            )}
            key={type}
            onClick={() => setSummaryType(type)}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={() => toast(`${summaryType} summary generation will be connected later.`)}
        type="button"
      >
        <Sparkles className="size-4" />
        Generate Summary
      </Button>

      {summary ? (
        <Button asChild className="w-full" variant="outline">
          <Link to={`/app/summaries/${summary.id}`}>
            <BookOpen className="size-4" />
            View full summary
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

function CitationEditDialog({ metadata, onSave, open, onOpenChange }) {
  const [draft, setDraft] = useState(metadata)

  function updateField(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave(draft)
    onOpenChange(false)
    toast("Citation metadata updated.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#E9C8F2]/80 sm:max-w-lg dark:border-primary/20">
        <DialogHeader>
          <DialogTitle>Edit Citation Metadata</DialogTitle>
          <DialogDescription>
            Update local prototype fields used to generate citation formats.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Title
              </span>
              <Input value={draft.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Author
              </span>
              <Input value={draft.author} onChange={(event) => updateField("author", event.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Organization
              </span>
              <Input value={draft.organization} onChange={(event) => updateField("organization", event.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Year
              </span>
              <Input value={draft.year} onChange={(event) => updateField("year", event.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                File type
              </span>
              <Input value={draft.sourceType} onChange={(event) => updateField("sourceType", event.target.value)} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                URL or source link
              </span>
              <Input value={draft.url} onChange={(event) => updateField("url", event.target.value)} />
            </label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Metadata</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CitationPanel({ file, repository }) {
  const [format, setFormat] = useState("APA")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [metadata, setMetadata] = useState(() =>
    buildCitationMetadata(file, repository)
  )
  const citation = createCitation(format, metadata)

  async function handleCopy() {
    try {
      await globalThis.navigator?.clipboard?.writeText(citation)
      toast("Citation copied.")
    } catch {
      toast("Citation copied.")
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">
        Generate citations from editable file metadata.
      </p>

      <div className="grid grid-cols-3 rounded-2xl border border-border bg-background/80 p-1">
        {citationFormats.map((item) => (
          <button
            className={cn(
              "rounded-xl px-2 py-1.5 text-xs font-medium transition",
              format === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
            key={item}
            onClick={() => setFormat(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
        <p className="text-sm leading-6 text-foreground">{citation}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Button onClick={handleCopy} type="button">
          <Copy className="size-4" />
          Copy Citation
        </Button>
        <Button onClick={() => setIsEditOpen(true)} type="button" variant="outline">
          <Pencil className="size-4" />
          Edit Metadata
        </Button>
      </div>

      <div className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground">
        <p>Title: {metadata.title}</p>
        <p>Author: {metadata.author}</p>
        <p>Access date: {metadata.accessDate}</p>
      </div>

      <CitationEditDialog
        metadata={metadata}
        onOpenChange={setIsEditOpen}
        onSave={setMetadata}
        open={isEditOpen}
      />
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

function DetailsPanel({ file, folder, repository }) {
  const metric = getFileMetric(file)

  return (
    <div className="space-y-4">
      <dl className="space-y-3">
        <DetailRow label="File name" value={file.name} />
        <DetailRow label="Type" value={getFileTypeLabel(file)} />
        <DetailRow label="Size" value={file.size} />
        {metric ? <DetailRow label={metric.label} value={metric.value} /> : null}
        <DetailRow label="Repository" value={repository.title} />
        <DetailRow label="Folder" value={folder?.name ?? "Root level"} />
        <DetailRow label="Uploaded" value={formatDate(file.uploadedAt)} />
        <DetailRow label="Updated" value={formatDate(file.updatedAt ?? file.uploadedAt)} />
      </dl>

      <div className="flex flex-wrap gap-2">
        <VisibilityBadge visibility={repository.visibility} />
        <TrustBadge level={repository.trustLabel}>
          {toTitleCase(repository.trustLabel)}
        </TrustBadge>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Tags</p>
        <div className="flex flex-wrap gap-2">
          {(repository.tags ?? []).map((tag) => (
            <Badge className="rounded-xl" key={tag} variant="outline">
              <Tag className="size-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityPanel({ file, summary }) {
  const activities = [
    {
      detail: `${file.name} was added to the repository workspace.`,
      icon: FileQuestion,
      title: "Uploaded file",
      when: file.uploadedAt,
    },
    {
      detail: "File metadata was reviewed for preview and citation fields.",
      icon: Info,
      title: "Updated metadata",
      when: file.updatedAt ?? file.uploadedAt,
    },
    {
      detail: summary
        ? `${summary.title} was generated from this file.`
        : "Summary generation is ready for this file.",
      icon: Sparkles,
      title: "Generated summary",
      when: summary?.generatedAt ?? file.updatedAt ?? file.uploadedAt,
    },
    {
      detail: "Citation was copied from the metadata-based citation panel.",
      icon: Quote,
      title: "Copied citation",
      when: file.updatedAt ?? file.uploadedAt,
    },
    {
      detail: "Academic tags were associated through the repository metadata.",
      icon: Tag,
      title: "Added tag",
      when: file.updatedAt ?? file.uploadedAt,
    },
  ]

  return (
    <div className="space-y-3">
      {activities.map((item) => {
        const Icon = item.icon

        return (
          <article className="flex gap-3" key={`${item.title}-${item.detail}`}>
            <span className="inline-grid size-9 shrink-0 place-items-center rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] text-primary dark:border-primary/20 dark:bg-primary/5">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.when)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function FileAssistantPanel({ file, folder, repository, summary }) {
  return (
    <aside className="renote-card overflow-hidden lg:sticky lg:top-24 lg:self-start">
      <Tabs defaultValue="summary">
        <div className="border-b border-[#E9C8F2]/70 p-3 dark:border-border/70">
          <TabsList className="grid h-auto w-full grid-cols-4 rounded-2xl bg-[#F7ECFB] p-1 dark:bg-primary/10">
            <TabsTrigger className="px-2 text-xs" value="summary">
              AI Summary
            </TabsTrigger>
            <TabsTrigger className="px-2 text-xs" value="citation">
              Citation
            </TabsTrigger>
            <TabsTrigger className="px-2 text-xs" value="details">
              Details
            </TabsTrigger>
            <TabsTrigger className="px-2 text-xs" value="activity">
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent className="m-0 p-4" value="summary">
          <SummaryPanel file={file} summary={summary} />
        </TabsContent>
        <TabsContent className="m-0 p-4" value="citation">
          <CitationPanel file={file} repository={repository} />
        </TabsContent>
        <TabsContent className="m-0 p-4" value="details">
          <DetailsPanel file={file} folder={folder} repository={repository} />
        </TabsContent>
        <TabsContent className="m-0 p-4" value="activity">
          <ActivityPanel file={file} summary={summary} />
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function FilePreviewPage() {
  const { fileId } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const file = mockFiles.find((item) => item.id === fileId)
  const repository = file
    ? mockRepositories.find((item) => item.id === file.repositoryId)
    : null
  const folder = file
    ? mockFolders.find((item) => item.id === file.folderId)
    : null
  const summary = useMemo(
    () => mockSummaries.find((item) => item.fileId === fileId),
    [fileId]
  )
  const totalPages = file ? getFilePageCount(file) : 1
  const previewPage = clampPage(currentPage, totalPages)

  useEffect(() => {
    setCurrentPage(1)
  }, [fileId])

  useEffect(() => {
    setCurrentPage((page) => clampPage(page, totalPages))
  }, [totalPages])

  if (!file || !repository) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/app/my-repositories">Back to My Repositories</Link>
            </Button>
          }
          description="This prototype file could not be found."
          icon={FileQuestion}
          title="File not found"
        />
      </PageShell>
    )
  }

  return (
    <PageShell className="max-w-[1500px] space-y-5 py-6 sm:py-8" size="wide">
      <FileHeader file={file} folder={folder} repository={repository} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-5">
          <FilePreviewPanel
            currentPage={previewPage}
            file={file}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
          <AskAiSection />
        </main>

        <FileAssistantPanel
          file={file}
          folder={folder}
          repository={repository}
          summary={summary}
        />
      </div>
    </PageShell>
  )
}

export default FilePreviewPage
