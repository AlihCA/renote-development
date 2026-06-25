import {
  Bell,
  BookOpen,
  FileText,
  FolderOpen,
  Moon,
  Palette,
  Plus,
  Search,
  Sparkles,
  Sun,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import useTheme from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

function DesignSystemPage() {
  const { setTheme, theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <PageShell className="space-y-8">
      <PageHeader
        actions={
          <Button onClick={toggleTheme} variant="secondary">
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        }
        description="Core ReNote UI pieces for the academic workspace foundation."
        eyebrow="Phase 1"
        icon={Palette}
        title="Design System"
      />

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Buttons</h2>
          <p className="text-sm text-muted-foreground">
            Primary actions stay purple while secondary actions stay quiet.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Plus className="size-4" />
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Cards</h2>
          <p className="text-sm text-muted-foreground">
            Modular surfaces for repository, collection, and summary previews.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard
            description="A calm card for everyday workspace content."
            icon={BookOpen}
            title="Repository Card"
          >
            <div className="flex flex-wrap gap-2">
              <TrustBadge level="verified">Verified</TrustBadge>
              <VisibilityBadge visibility="public" />
            </div>
          </SectionCard>
          <SectionCard
            description="A lighter card for secondary summaries."
            icon={FolderOpen}
            title="Collection Card"
            variant="muted"
          >
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <VisibilityBadge visibility="restricted" />
            </div>
          </SectionCard>
          <SectionCard
            description="A soft glow for landing and AI-focused moments."
            icon={Sparkles}
            title="AI Summary Card"
            variant="glow"
          >
            <p className="text-sm text-muted-foreground">
              Highlighted surfaces should stay rare and intentional.
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Stats</h2>
          <p className="text-sm text-muted-foreground">
            Small dashboard metrics for signed-in workspaces.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            description="Repositories ready for future uploads."
            icon={BookOpen}
            title="Repositories"
            trend="+3 this week"
            value="12"
          />
          <StatCard
            description="Study sets organized by course or topic."
            icon={FolderOpen}
            title="Collections"
            value="8"
            variant="muted"
          />
          <StatCard
            description="AI summary placeholders for Phase 2."
            icon={Sparkles}
            title="Summaries"
            trend="Prototype"
            value="24"
          />
        </div>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Badges</h2>
          <p className="text-sm text-muted-foreground">
            Status, trust, and visibility labels for repository metadata.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="draft" />
          <StatusBadge status="pending" />
          <StatusBadge status="approved" />
          <StatusBadge status="rejected" />
          <StatusBadge status="archived" />
          <TrustBadge level="official">Official</TrustBadge>
          <TrustBadge level="community">Community</TrustBadge>
          <VisibilityBadge visibility="public" />
          <VisibilityBadge visibility="private" />
          <VisibilityBadge visibility="unlisted" />
        </div>
      </section>

      <section className="renote-section">
        <div>
          <h2 className="text-xl font-semibold">Input</h2>
          <p className="text-sm text-muted-foreground">
            Search fields use a soft shell around the base shadcn input.
          </p>
        </div>
        <div className="renote-input-shell max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
            placeholder="Search repositories, notes, or authors"
            type="search"
          />
        </div>
      </section>

      <section className="renote-section grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Empty State</h2>
            <p className="text-sm text-muted-foreground">
              Friendly placeholders for future repository workflows.
            </p>
          </div>
          <EmptyState
            action={
              <Button variant="secondary">
                <Plus className="size-4" />
                New repository
              </Button>
            }
            description="Create a repository later to organize notes, files, and summaries."
            icon={FileText}
            title="No repositories yet"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Skeleton</h2>
            <p className="text-sm text-muted-foreground">
              Loading previews for cards and lists.
            </p>
          </div>
          <div className="renote-muted-card space-y-4 p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="renote-section grid gap-4 lg:grid-cols-2">
        <SectionCard
          description="Sonner is already mounted in the app shell."
          icon={Bell}
          title="Toasts"
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Repository saved")}>
              Success toast
            </Button>
            <Button
              onClick={() => toast("Summary queued for review")}
              variant="secondary"
            >
              Neutral toast
            </Button>
            <Button
              onClick={() => toast.error("Upload failed")}
              variant="destructive"
            >
              Error toast
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          description="The theme provider writes renote-theme to localStorage."
          icon={isDark ? Moon : Sun}
          title="Theme Preview"
          variant="muted"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className={cn(
                "rounded-2xl border bg-white p-4 text-left text-slate-950 shadow-sm transition",
                theme === "light" && "ring-3 ring-primary/25"
              )}
              onClick={() => setTheme("light")}
              type="button"
            >
              <span className="text-sm font-semibold">Light</span>
              <span className="mt-2 block text-xs text-slate-500">
                Clean academic default
              </span>
            </button>
            <button
              className={cn(
                "rounded-2xl border border-white/15 bg-slate-950 p-4 text-left text-white shadow-sm transition",
                theme === "dark" && "ring-3 ring-primary/35"
              )}
              onClick={() => setTheme("dark")}
              type="button"
            >
              <span className="text-sm font-semibold">Dark</span>
              <span className="mt-2 block text-xs text-slate-300">
                Optional focused workspace
              </span>
            </button>
          </div>
        </SectionCard>
      </section>
    </PageShell>
  )
}

export default DesignSystemPage
