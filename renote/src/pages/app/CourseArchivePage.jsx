import { Link } from "react-router"
import { Archive, BookOpen, FileText } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { PublicationBadge } from "@/components/course/ResourceStatusBadge"
import { Badge } from "@/components/ui/badge"
import { selectArchiveForUser } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function CourseArchivePage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const { courses: archivedCourses, resources: archivedResources } = selectArchiveForUser(state, appUser)

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Archived courses and resources are separate from Draft and Published states. Restoration controls come later."
        icon={Archive}
        title="Archive"
      />

      {archivedCourses.length || archivedResources.length ? (
        <div className="space-y-7">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Courses</h2>
            {archivedCourses.length ? archivedCourses.map((course) => (
              <article className="renote-card flex items-start gap-3 p-4" key={course.id}>
                <span className="renote-icon-container"><BookOpen className="size-5" /></span>
                <div className="flex-1">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{course.courseCode} · Archived {new Date(course.archivedAt).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline">Archived</Badge>
              </article>
            )) : <p className="text-sm text-muted-foreground">No archived courses.</p>}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Resources</h2>
            {archivedResources.length ? archivedResources.map((resource) => {
              const course = state.courses.find((item) => item.id === resource.courseId)
              return (
                <article className="renote-card flex items-start gap-3 p-4" key={resource.id}>
                  <span className="renote-icon-container"><FileText className="size-5" /></span>
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{course?.courseCode} · Archived {new Date(resource.archivedAt).toLocaleDateString()}</p>
                    <div className="mt-2"><PublicationBadge status={resource.publicationStatus} /></div>
                  </div>
                  <Badge variant="outline">Archived</Badge>
                </article>
              )
            }) : <p className="text-sm text-muted-foreground">No archived resources.</p>}
          </section>
        </div>
      ) : (
        <EmptyState description="Archived courses and resources will appear here." icon={Archive} title="Nothing archived" />
      )}

      <Link className="text-sm text-primary hover:underline" to="/app/dashboard">Back to Dashboard</Link>
    </PageShell>
  )
}

export default CourseArchivePage
