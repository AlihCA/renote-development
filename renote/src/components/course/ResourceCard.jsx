import { Link } from "react-router"
import { ArrowUpRight, FileText, Link2 } from "lucide-react"

import { PublicationBadge } from "@/components/course/ResourceStatusBadge"
import { Badge } from "@/components/ui/badge"
import { RESOURCE_TYPE } from "@/data/prototypeDomain"

function ResourceCard({ course, resource, showStatus = false, topic }) {
  const Icon = resource.resourceType === RESOURCE_TYPE.LINK ? Link2 : FileText

  return (
    <Link
      className="group flex min-w-0 items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to={`/app/files/${resource.id}`}
    >
      <span className="renote-icon-container size-10 shrink-0"><Icon className="size-4" /></span>
      <span className="min-w-0 flex-1 space-y-2">
        <span className="block truncate font-medium group-hover:text-primary">{resource.title}</span>
        <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {course ? <span>{course.courseCode}</span> : null}
          {topic ? <span>{topic.title}</span> : null}
          <Badge variant="outline">{resource.resourceType === RESOURCE_TYPE.LINK ? "Link" : (resource.fileType ?? "File").toUpperCase()}</Badge>
          {showStatus ? <PublicationBadge status={resource.publicationStatus} /> : null}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
    </Link>
  )
}

export default ResourceCard
