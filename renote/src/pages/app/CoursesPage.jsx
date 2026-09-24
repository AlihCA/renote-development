import { Link } from "react-router"
import { ArrowUpRight, BookOpen } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { selectCourseResources, selectCoursesForUser } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"
import { APP_ROLES } from "@/lib/roles"

function CoursesPage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const courses = selectCoursesForUser(state, appUser)
  const isFaculty = appUser.role === APP_ROLES.FACULTY

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description={isFaculty
          ? "Courses assigned to your Faculty prototype account. Course creation and editing arrive in the next step."
          : "Courses you belong to in this prototype. Joining by enrollment code arrives in the next step."}
        icon={BookOpen}
        title="My Courses"
      />

      {courses.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const resourceCount = selectCourseResources(state, course.id, appUser).length

            return (
              <Link
                className="renote-card group flex flex-col gap-4 p-5 transition-colors hover:border-primary/30 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                key={course.id}
                to={`/app/workspace/${course.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="renote-icon-container"><BookOpen className="size-5" /></span>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold group-hover:text-primary">{course.title}</h2>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{course.courseCode}</Badge>
                  {course.section ? <span>{course.section}</span> : null}
                  <span>{resourceCount} {resourceCount === 1 ? "resource" : "resources"}</span>
                </div>
                <p className="text-xs text-muted-foreground">Faculty: {course.facultyName}</p>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          description={isFaculty
            ? "No courses are assigned to this Faculty prototype account yet."
            : "You have not joined a course in this prototype yet."}
          icon={BookOpen}
          title="No courses yet"
        />
      )}
    </PageShell>
  )
}

export default CoursesPage
