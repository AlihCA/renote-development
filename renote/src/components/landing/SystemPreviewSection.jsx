import { Bot, FileText, FolderOpen, LayoutDashboard, Sparkles } from "lucide-react"

import SectionCard from "@/components/common/SectionCard"
import { Badge } from "@/components/ui/badge"

function DashboardPreview() {
  return (
    <SectionCard
      className="h-full"
      description="A clear starting point for academic activity."
      icon={LayoutDashboard}
      title="Dashboard preview"
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {["Repositories", "Summaries", "Requests"].map((item, index) => (
            <div className="rounded-2xl border bg-background/70 p-3" key={item}>
              <p className="text-xs text-muted-foreground">{item}</p>
              <p className="mt-2 text-2xl font-semibold">{[12, 28, 5][index]}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {["Capstone references", "Human computer interaction", "Research methods"].map(
            (item) => (
              <div
                className="flex items-center gap-3 rounded-2xl border bg-background/70 p-3"
                key={item}
              >
                <span className="renote-icon-container size-9">
                  <FolderOpen className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item}</p>
                  <p className="text-xs text-muted-foreground">Updated for review</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            )
          )}
        </div>
      </div>
    </SectionCard>
  )
}

function WorkspacePreview() {
  return (
    <SectionCard
      className="h-full"
      description="Repository organization with nested folders."
      icon={FolderOpen}
      title="Repository workspace preview"
    >
      <div className="space-y-3">
        {[
          ["Research papers", "8 files"],
          ["Lecture materials", "14 files"],
          ["Reference links", "6 resources"],
        ].map(([title, meta]) => (
          <div
            className="flex items-center justify-between rounded-2xl border bg-background/70 p-3"
            key={title}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="renote-icon-container size-9">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{meta}</p>
              </div>
            </div>
            <Badge className="shrink-0" variant="outline">
              Trusted
            </Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function AiPreview() {
  return (
    <SectionCard
      className="h-full"
      description="A focused panel for AI-assisted academic review."
      icon={Bot}
      title="AI summary preview"
      variant="glow"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border bg-background/75 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold">Summary draft</p>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-primary/20" />
            <div className="h-2.5 w-10/12 rounded-full bg-primary/15" />
            <div className="h-2.5 w-7/12 rounded-full bg-primary/10" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Key concepts</Badge>
          <Badge variant="outline">Citation needed</Badge>
          <Badge variant="outline">Review ready</Badge>
        </div>
      </div>
    </SectionCard>
  )
}

function SystemPreviewSection() {
  return (
    <section className="scroll-mt-20 border-y bg-muted/35" id="preview">
      <div className="renote-container space-y-8 py-12 sm:py-16">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            System preview
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A simple preview of how the ReNote workspace comes together.
          </h2>
          <p className="text-muted-foreground">
            These are lightweight interface mockups, not production screenshots,
            built to show the app direction clearly.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardPreview />
          <WorkspacePreview />
          <AiPreview />
        </div>
      </div>
    </section>
  )
}

export default SystemPreviewSection
