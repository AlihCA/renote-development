import { FileText, Layers, ShieldAlert } from "lucide-react"

import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"

const problems = [
  {
    icon: FileText,
    title: "Scattered academic files",
    description:
      "Notes, readings, links, and references often live in separate tools, folders, and message threads.",
  },
  {
    icon: Layers,
    title: "Information overload",
    description:
      "Long materials pile up quickly, making it harder to review what matters before classes, reports, or exams.",
  },
  {
    icon: ShieldAlert,
    title: "Unreliable learning resources",
    description:
      "Students need clearer signals for source quality, access level, and whether a resource is ready to use.",
  },
]

function ProblemSection() {
  return (
    <div className="scroll-mt-20" id="problem">
      <PageShell className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            The problem
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Scattered academic resources make studying harder.
          </h2>
          <p className="text-muted-foreground">
            ReNote starts from the everyday friction of school work: files are
            scattered, resources are dense, and trust is not always obvious.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((problem) => (
            <SectionCard
              className="h-full"
              description={problem.description}
              icon={problem.icon}
              key={problem.title}
              title={problem.title}
            />
          ))}
        </div>
      </PageShell>
    </div>
  )
}

export default ProblemSection
