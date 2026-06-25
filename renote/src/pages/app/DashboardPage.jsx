import { BookOpen, FolderOpen, Sparkles, Users } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import StatCard from "@/components/common/StatCard"
import StatusBadge from "@/components/common/StatusBadge"
import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import { Button } from "@/components/ui/button"

function DashboardPage() {
  return (
    <PageShell className="space-y-8">
      <PageHeader
        actions={<Button>Create Repository</Button>}
        description="A signed-in overview for repositories, collections, and upcoming AI summaries."
        eyebrow="Workspace"
        icon={BookOpen}
        title="Dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description="Prototype repositories ready for future uploads."
          icon={BookOpen}
          title="Repositories"
          value="12"
        />
        <StatCard
          description="Grouped materials for courses and topics."
          icon={FolderOpen}
          title="Collections"
          value="8"
          variant="muted"
        />
        <StatCard
          description="Placeholder count for AI-focused workflows."
          icon={Sparkles}
          title="AI Summaries"
          trend="Phase 2"
          value="24"
        />
        <StatCard
          description="Future access controls and collaboration."
          icon={Users}
          title="Members"
          value="5"
          variant="muted"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          description="A simple workspace snapshot while backend features are still out of scope."
          icon={FolderOpen}
          title="Recent Repository"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="mr-auto font-semibold">
                  Research Methods Notes
                </h2>
                <TrustBadge level="verified">Verified</TrustBadge>
                <VisibilityBadge visibility="restricted" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A placeholder repository for readings, lecture notes, and
                summary previews.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="pending">2 access requests</StatusBadge>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          description="Phase 1 keeps AI visual language soft and minimal."
          icon={Sparkles}
          title="AI Summary Preview"
          variant="glow"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            Future summaries will appear here after OpenAI integration is added
            in a later phase.
          </p>
        </SectionCard>
      </div>
    </PageShell>
  )
}

export default DashboardPage
