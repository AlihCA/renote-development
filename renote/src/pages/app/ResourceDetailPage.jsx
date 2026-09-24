import { Link, useParams } from "react-router"
import { ArrowLeft, ArrowUpRight, BookOpen, Copy, FileText, Link2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { ProcessingBadge, PublicationBadge } from "@/components/course/ResourceStatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RESOURCE_TYPE, selectResourceForUser } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function ResourceDetailPage() {
  // The legacy URL parameter remains fileId while the page resolves a Resource.
  const { fileId: resourceId } = useParams()
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const resource = selectResourceForUser(state, resourceId, appUser)

  if (!resource) {
    return (
      <PageShell>
        <EmptyState
          action={<Button asChild><Link to="/app/courses">Back to My Courses</Link></Button>}
          description="This resource is unavailable in your current prototype role or publication state."
          icon={FileText}
          title="Resource not found"
        />
      </PageShell>
    )
  }

  const course = state.courses.find((item) => item.id === resource.courseId)
  const topic = state.topics.find((item) => item.id === resource.topicId)
  const isLink = resource.resourceType === RESOURCE_TYPE.LINK
  const citation = `${course.facultyName}. (${new Date(resource.createdAt).getUTCFullYear()}). ${resource.title}. ReNote: ${course.courseCode}.`

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(citation)
      toast.success("Prototype citation copied.")
    } catch {
      toast.error("Could not copy the citation in this browser.")
    }
  }

  return (
    <PageShell className="space-y-7">
      <Button asChild className="w-fit" size="sm" variant="ghost">
        <Link to={`/app/workspace/${course.id}`}><ArrowLeft className="size-4" />Back to Course</Link>
      </Button>
      <PageHeader
        description={resource.description ?? "Course material provided by Faculty."}
        icon={isLink ? Link2 : FileText}
        title={resource.title}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{course.courseCode}</Badge>
          <span>{course.title}</span>
          <span>{topic?.title}</span>
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        <PublicationBadge status={resource.publicationStatus} />
        <ProcessingBadge status={resource.processingStatus} />
        <Badge variant="outline">{isLink ? "Link resource" : `File · ${(resource.fileType ?? "unknown").toUpperCase()}`}</Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <SectionCard
            description={isLink
              ? "This prototype stores a link reference. ReNote does not load or extract the external page."
              : "The frontend currently stores file metadata only. File storage and rendering come later."}
            icon={isLink ? Link2 : FileText}
            title={isLink ? "Linked material" : "File preview"}
          >
            {isLink ? (
              <div className="space-y-4">
                <p className="break-all text-sm text-muted-foreground">{resource.url}</p>
                <Button asChild size="sm" variant="outline">
                  <a href={resource.url} rel="noopener noreferrer" target="_blank">
                    Open source link <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                <FileText className="mx-auto size-8 text-primary" />
                <p className="mt-3 font-medium">{resource.fileName}</p>
                <p className="mt-1 text-sm text-muted-foreground">No file bytes are stored in this prototype.</p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            description="Summary and question-answering concepts are retained for later AI integration."
            icon={Sparkles}
            title="AI study tools"
          >
            <p className="text-sm text-muted-foreground">
              Processing status is tracked separately from publication. AI answers are not generated in this step.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard icon={BookOpen} title="Course context">
            <dl className="space-y-3 text-sm">
              <div><dt className="text-muted-foreground">Course</dt><dd className="font-medium">{course.title}</dd></div>
              <div><dt className="text-muted-foreground">Topic / Week</dt><dd className="font-medium">{topic?.title}</dd></div>
              <div><dt className="text-muted-foreground">Faculty</dt><dd className="font-medium">{course.facultyName}</dd></div>
            </dl>
          </SectionCard>
          <SectionCard icon={Copy} title="Citation preview">
            <p className="text-sm leading-6 text-muted-foreground">{citation}</p>
            <Button className="mt-4" onClick={copyCitation} size="sm" type="button" variant="outline">
              <Copy className="size-4" />Copy citation
            </Button>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}

export default ResourceDetailPage
