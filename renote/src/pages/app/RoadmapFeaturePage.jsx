import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  History,
  MessageSquare,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { roadmapNavItems } from "@/data/navigation"

const roadmapIcons = {
  "Advanced Semantic Search": Search,
  "AI Recommendations": Sparkles,
  "Comments & Ratings": MessageSquare,
  "Advanced Citation": Quote,
  "Summary Versions": History,
  "Admin Moderation": ShieldCheck,
  "Verification Workflow": BadgeCheck,
}

const mvpNotes = [
  "This page is included for roadmap visibility during prototype review.",
  "The feature is not part of the current MVP scope and is not connected to backend services yet.",
  "Future implementation may require product decisions, data models, permissions, and API integration.",
]

function RoadmapFeaturePage() {
  const { featureSlug } = useParams()
  const feature = roadmapNavItems.find((item) => item.slug === featureSlug)

  if (!feature) {
    return (
      <PageShell className="space-y-7" size="narrow">
        <EmptyState
          action={
            <Button asChild variant="secondary">
              <Link to="/app/dashboard">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          }
          icon={Sparkles}
          title="Roadmap item not found"
          description="This future enhancement is not listed in the current ReNote roadmap."
        />
      </PageShell>
    )
  }

  const Icon = roadmapIcons[feature.label] ?? Sparkles

  return (
    <PageShell className="space-y-7" size="narrow">
      <Button asChild className="w-fit" variant="ghost">
        <Link to="/app/dashboard">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </Button>

      <PageHeader
        description={feature.description}
        eyebrow="Roadmap"
        icon={Icon}
        title={feature.label}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>Planned Future Enhancement</Badge>
          <Badge variant="outline">Not part of current MVP</Badge>
        </div>
      </PageHeader>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <SectionCard
          description="A clear placeholder keeps the navigation usable while showing where the product can grow next."
          icon={Icon}
          title="Feature Overview"
        >
          <div className="space-y-4">
            <p className="leading-6 text-muted-foreground">
              {feature.label} is planned as a future ReNote enhancement. It is
              shown in the sidebar for roadmap clarity, demo storytelling, and
              defense readiness, but the current MVP remains focused on the
              implemented frontend prototype flows.
            </p>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">
                Current MVP note
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This feature is intentionally presented as planned work. It does
                not run real AI, moderation, verification, citation automation,
                or backend processing yet.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          description="What should be decided before building this feature."
          icon={CheckCircle2}
          title="Future Readiness"
          variant="muted"
        >
          <ul className="space-y-3">
            {mvpNotes.map((note) => (
              <li className="flex gap-3 leading-6 text-muted-foreground" key={note}>
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>
    </PageShell>
  )
}

export default RoadmapFeaturePage
