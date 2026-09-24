import { Link, useParams } from "react-router"
import { ArrowLeft, BookOpen, Layers3 } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import ResourceCard from "@/components/course/ResourceCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  selectCourseForUser,
  selectCourseResources,
  selectTopicsForCourse,
} from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"
import { APP_ROLES } from "@/lib/roles"

function CourseWorkspacePage() {
  // The legacy URL parameter remains repositoryId until route migration is safe.
  const { repositoryId: courseId } = useParams()
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const course = selectCourseForUser(state, courseId, appUser)

  if (!course) {
    return (
      <PageShell>
        <EmptyState
          action={<Button asChild><Link to="/app/courses">Back to My Courses</Link></Button>}
          description="This course is unavailable in your current prototype role or membership."
          icon={BookOpen}
          title="Course not found"
        />
      </PageShell>
    )
  }

  const topics = selectTopicsForCourse(state, course.id)
  const resources = selectCourseResources(state, course.id, appUser)
  const showStatus = appUser.role === APP_ROLES.FACULTY

  return (
    <PageShell className="space-y-7">
      <Button asChild className="w-fit" size="sm" variant="ghost">
        <Link to="/app/courses"><ArrowLeft className="size-4" />Back to My Courses</Link>
      </Button>
      <PageHeader
        description={course.description}
        icon={BookOpen}
        title={course.title}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{course.courseCode}</Badge>
          <span>{course.section}</span>
          <span>{course.academicTerm}</span>
          <span>Faculty: {course.facultyName}</span>
        </div>
      </PageHeader>

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Topics and Weeks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Materials are organized in one ordered level within this course.
          </p>
        </div>
        {topics.map((topic) => {
          const topicResources = resources.filter((resource) => resource.topicId === topic.id)

          return (
            <section className="renote-card space-y-4 p-5" key={topic.id}>
              <div className="flex items-start gap-3">
                <span className="renote-icon-container"><Layers3 className="size-5" /></span>
                <div>
                  <h3 className="font-semibold">{topic.title}</h3>
                  {topic.description ? <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p> : null}
                </div>
              </div>
              {topicResources.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {topicResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} showStatus={showStatus} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  {showStatus ? "No resources in this topic yet." : "No published resources in this topic yet."}
                </p>
              )}
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}

export default CourseWorkspacePage
