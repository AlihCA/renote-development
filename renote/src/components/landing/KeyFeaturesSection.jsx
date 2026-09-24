import {
  Bell,
  Bot,
  BookOpen,
  FileText,
  LayoutDashboard,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"

const features = [
  {
    icon: LayoutDashboard,
    title: "Academic Workspace",
    description: "A focused place to find materials for teaching and learning.",
  },
  {
    icon: BookOpen,
    title: "Faculty Materials",
    description: "Course resources are organized around faculty-provided content.",
  },
  {
    icon: FileText,
    title: "Resource Preview",
    description: "Open files and links from a clear materials workspace.",
  },
  {
    icon: Bot,
    title: "AI Assistant Preview",
    description: "Explore the interface planned for questions and summaries.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "See updates in one place as the course platform develops.",
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
              A focused foundation for course materials.
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
