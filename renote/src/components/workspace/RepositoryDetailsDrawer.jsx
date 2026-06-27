import { Eye, FileText, FolderOpen, Sparkles, Target } from "lucide-react"

import TrustBadge from "@/components/common/TrustBadge"
import VisibilityBadge from "@/components/common/VisibilityBadge"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function formatNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value)
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
      <Icon className="mb-2 size-4 text-primary" />
      <p className="text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function RepositoryDetailsDrawer({
  files,
  folders,
  isOpen,
  onOpenChange,
  repository,
  summaries,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Repository Details</SheetTitle>
          <SheetDescription>
            Ownership, trust, counts, and learning scope for this repository.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-6 pb-6">
          <section className="rounded-3xl border border-border bg-background/80 p-4">
            <dl className="space-y-3 text-sm">
              <InfoRow label="Owner" value={repository.ownerName} />
              <InfoRow label="Subject" value={repository.subject} />
              <div className="space-y-2">
                <dt className="text-muted-foreground">Access and trust</dt>
                <dd className="flex flex-wrap gap-2">
                  <VisibilityBadge visibility={repository.visibility} />
                  <TrustBadge level={repository.trustLabel}>
                    {toLabel(repository.trustLabel)}
                  </TrustBadge>
                </dd>
              </div>
            </dl>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <MiniStat icon={FileText} label="Files" value={files.length} />
            <MiniStat icon={FolderOpen} label="Folders" value={folders.length} />
            <MiniStat icon={Sparkles} label="Summaries" value={summaries.length} />
            <MiniStat icon={Eye} label="Views" value={formatNumber(repository.views)} />
          </section>

          <section className="space-y-3 rounded-3xl border border-border bg-background/80 p-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <h3 className="font-semibold tracking-tight">Learning Objectives</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {repository.learningObjectives.map((objective) => (
                <li className="flex gap-2" key={objective}>
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold tracking-tight">Included Topics</h3>
            <div className="flex flex-wrap gap-2">
              {repository.includedTopics.map((topic) => (
                <Badge className="rounded-xl" key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default RepositoryDetailsDrawer
