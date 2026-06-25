import {
  Bell,
  BookOpen,
  CheckCircle2,
  Eye,
  FolderOpen,
  Globe2,
  Inbox,
  Lock,
  Moon,
  Palette,
  Plus,
  Search,
  Sparkles,
  Sun,
  UploadCloud,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import StatCard from "@/components/common/StatCard"
import StatusBadge from "@/components/common/StatusBadge"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import FileTypeIcon from "@/components/files/FileTypeIcon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  mockCollections,
  mockFiles,
  mockNotifications,
  mockRepositories,
  mockSummaries,
  mockUsers,
} from "@/data"
import useTheme from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

const iconChips = [
  { Icon: BookOpen, label: "Repository" },
  { Icon: FolderOpen, label: "Collection" },
  { Icon: Sparkles, label: "AI" },
  { Icon: Users, label: "Class" },
  { Icon: Lock, label: "Private" },
  { Icon: CheckCircle2, label: "Verified" },
]

const statusSamples = ["draft", "pending", "approved", "rejected", "archived"]
const visibilitySamples = ["public", "private", "restricted", "unlisted"]
const fileTypeSamples = [
  { extension: "pdf", label: "PDF" },
  { extension: "docx", label: "DOCX" },
  { extension: "xlsx", label: "XLSX" },
  { extension: "pptx", label: "PPTX" },
  { type: "image/png", label: "PNG" },
  { type: "url", label: "Link" },
  { extension: "zip", label: "Default" },
]
const mockDataStats = [
  { label: "Users", value: mockUsers.length },
  { label: "Repositories", value: mockRepositories.length },
  { label: "Files", value: mockFiles.length },
  { label: "Collections", value: mockCollections.length },
  { label: "Summaries", value: mockSummaries.length },
  { label: "Notifications", value: mockNotifications.length },
]

function DesignSystemPage() {
  const { setTheme, theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <PageShell className="space-y-10" size="wide">
      <PageHeader
        actions={
          <Button onClick={toggleTheme} variant="secondary">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        }
        description="Common ReNote surfaces for the Phase 1 academic workspace."
        eyebrow="Phase 1 foundation"
        icon={Palette}
        title="Design System"
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          description="Solid primary actions, quiet secondary actions, and compact icon buttons."
          icon={Plus}
          title="Buttons"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <Plus className="size-4" />
              New repository
            </Button>
            <Button variant="secondary">Invite class</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="ghost">Cancel</Button>
            <Button size="icon" variant="secondary">
              <Bell className="size-4" />
            </Button>
            <Button variant="destructive">Remove</Button>
          </div>
        </SectionCard>

        <SectionCard
          description="Soft rounded search and form fields for repository workflows."
          icon={Search}
          title="Inputs and Search"
          variant="muted"
        >
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
            <div className="renote-input-shell">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                placeholder="Search repositories, notes, or authors"
                type="search"
              />
            </div>
            <Input placeholder="Course code" />
          </div>
        </SectionCard>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Cards</h2>
          <p className="text-sm text-muted-foreground">
            Repository, collection, and AI-focused examples.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard
            description="Lecture notes, readings, and shared class references."
            icon={BookOpen}
            title="Research Methods"
          >
            <div className="flex flex-wrap gap-2">
              <TrustBadge level="verified">Verified</TrustBadge>
              <VisibilityBadge visibility="public" />
            </div>
          </SectionCard>
          <SectionCard
            description="Grouped materials for a course or study topic."
            icon={FolderOpen}
            title="Midterm Review"
            variant="muted"
          >
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <VisibilityBadge visibility="restricted" />
            </div>
          </SectionCard>
          <SectionCard
            description="A subtle accent treatment for future AI summaries."
            icon={Sparkles}
            title="Summary Draft"
            variant="glow"
          >
            <p className="text-sm leading-6 text-muted-foreground">
              Key terms, outline points, and review prompts can sit here later.
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Stat Cards</h2>
          <p className="text-sm text-muted-foreground">
            Dashboard-ready metrics with calm icon chips.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            description="Prototype repositories ready for future uploads."
            icon={BookOpen}
            title="Repositories"
            trend="+3 this week"
            value="12"
          />
          <StatCard
            description="Study sets grouped by course or topic."
            icon={FolderOpen}
            title="Collections"
            value="8"
            variant="muted"
          />
          <StatCard
            description="Reserved for later AI integration."
            icon={Sparkles}
            title="Summaries"
            trend="Phase 2"
            value="24"
            variant="glow"
          />
          <StatCard
            description="Classmates and future collaborators."
            icon={Users}
            title="Members"
            value="5"
            variant="muted"
          />
        </div>
      </section>

      <SectionCard
        description="Reusable prototype records now available from src/data."
        icon={FolderOpen}
        title="Mock Data Snapshot"
        variant="muted"
      >
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {mockDataStats.map((item) => (
            <div
              className="rounded-2xl border bg-background/70 p-3"
              key={item.label}
            >
              <p className="text-2xl font-semibold tracking-tight">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="renote-preview-tile">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Icon Chips</h2>
            <p className="text-sm text-muted-foreground">
              Rounded-square chips for tool and metadata icons.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {iconChips.map(({ Icon, label }) => (
              <div
                className="flex items-center gap-3 rounded-2xl border bg-background/70 p-3"
                key={label}
              >
                <span className="renote-icon-container">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="renote-preview-tile">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Badges</h2>
            <p className="text-sm text-muted-foreground">
              Status, trust, and visibility labels for repository metadata.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm font-medium">Status</p>
              <div className="flex flex-wrap gap-2">
                {statusSamples.map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Trust</p>
              <div className="flex flex-wrap gap-2">
                <TrustBadge level="verified">Verified</TrustBadge>
                <TrustBadge level="official">Official</TrustBadge>
                <TrustBadge level="community">Community</TrustBadge>
                <TrustBadge level="trusted">Trusted</TrustBadge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Visibility</p>
              <div className="flex flex-wrap gap-2">
                {visibilitySamples.map((visibility) => (
                  <VisibilityBadge key={visibility} visibility={visibility} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="renote-preview-tile">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">File Type Icons</h2>
          <p className="text-sm text-muted-foreground">
            Rounded-square indicators for future repository file lists.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fileTypeSamples.map((sample) => (
            <div
              className="flex items-center gap-3 rounded-2xl border bg-background/70 p-3"
              key={sample.label}
            >
              <FileTypeIcon extension={sample.extension} type={sample.type} />
              <div>
                <p className="text-sm font-medium">{sample.label}</p>
                <p className="text-xs text-muted-foreground">
                  {sample.extension ?? sample.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <EmptyState
          action={
            <Button variant="secondary">
              <UploadCloud className="size-4" />
              Add materials
            </Button>
          }
          description="Create a repository later to organize notes, files, and summaries."
          icon={Inbox}
          title="No repositories yet"
        />

        <div className="renote-preview-tile space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Skeleton</h2>
            <p className="text-sm text-muted-foreground">
              Soft loading placeholders for lists and cards.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border bg-background/70 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          description="Sonner examples for common app feedback."
          icon={Bell}
          title="Toast Examples"
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Repository saved")}>
              <CheckCircle2 className="size-4" />
              Success
            </Button>
            <Button
              onClick={() => toast("Summary queued for review")}
              variant="secondary"
            >
              <Sparkles className="size-4" />
              Neutral
            </Button>
            <Button
              onClick={() => toast.error("Upload failed")}
              variant="destructive"
            >
              Error
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          description="Light remains the default, with a clean dark workspace available."
          icon={isDark ? Moon : Sun}
          title="Light and Dark Preview"
          variant="muted"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className={cn(
                "rounded-2xl border bg-white p-4 text-left text-slate-950 shadow-sm transition hover:border-violet-300",
                theme === "light" && "ring-3 ring-primary/25"
              )}
              onClick={() => setTheme("light")}
              type="button"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Sun className="size-4 text-violet-600" />
                Light
              </span>
              <span className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Eye className="size-3" />
                Academic default
              </span>
            </button>
            <button
              className={cn(
                "rounded-2xl border border-white/15 bg-slate-950 p-4 text-left text-white shadow-sm transition hover:border-violet-300/60",
                theme === "dark" && "ring-3 ring-primary/35"
              )}
              onClick={() => setTheme("dark")}
              type="button"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Moon className="size-4 text-violet-200" />
                Dark
              </span>
              <span className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                <Globe2 className="size-3" />
                Focused workspace
              </span>
            </button>
          </div>
        </SectionCard>
      </section>
    </PageShell>
  )
}

export default DesignSystemPage
