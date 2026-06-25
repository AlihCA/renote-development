import {
  Bell,
  Bot,
  Clock3,
  FolderOpen,
  KeyRound,
  Layers,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"

const features = [
  {
    icon: LayoutDashboard,
    title: "Repository Management",
    description: "Create academic spaces for course modules, projects, and shared materials.",
  },
  {
    icon: FolderOpen,
    title: "Nested Folders",
    description: "Arrange readings, files, and links into a structure that stays easy to scan.",
  },
  {
    icon: Bot,
    title: "AI Summary Panel",
    description: "Open a focused review area for summaries, key points, and study prompts.",
  },
  {
    icon: Clock3,
    title: "Summary History",
    description: "Return to previous AI-assisted reviews without losing learning context.",
  },
  {
    icon: Layers,
    title: "Collections / Study Boards",
    description: "Build selected sets of resources for classes, reports, or exam review.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Labels",
    description: "Mark resources by source quality, visibility, and review status.",
  },
  {
    icon: KeyRound,
    title: "Access Requests",
    description: "Keep private resources controlled while still supporting collaboration.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Track resource updates, access activity, and review events in one place.",
  },
]

function KeyFeaturesSection() {
  return (
    <div className="scroll-mt-20" id="features">
      <PageShell className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Key features
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to organize, review, and share academic resources.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <SectionCard
              className="h-full"
              description={feature.description}
              icon={feature.icon}
              key={feature.title}
              title={feature.title}
            />
          ))}
        </div>
      </PageShell>
    </div>
  )
}

export default KeyFeaturesSection
