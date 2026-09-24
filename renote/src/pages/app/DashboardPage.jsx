import { Link } from "react-router"
import { ArrowUpRight, BookOpen, FileText, Search } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { selectCourseResources, selectCoursesForUser } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function DashboardPage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const courses = selectCoursesForUser(state, appUser)
  const resourceCount = courses.reduce(
    (count, course) => count + selectCourseResources(state, course.id, appUser).length,
    0
  )

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/app/search"><Search className="size-4" />Search materials</Link>
          </Button>
        }
        description="Find materials in the courses you joined at PUP Parañaque. Enrollment-code joining arrives in the next step."
        title="Student Dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionCard icon={BookOpen} title="Joined courses">
          <p className="text-2xl font-semibold">{courses.length}</p>
          <p className="mt-1 text-muted-foreground">From your prototype course memberships</p>
        </SectionCard>
        <SectionCard icon={FileText} title="Available resources">
          <p className="text-2xl font-semibold">{resourceCount}</p>
          <p className="mt-1 text-muted-foreground">Published files and links in joined courses</p>
        </SectionCard>
      </div>

      <SectionCard
        action={
          <Button asChild size="sm" variant="outline">
            <Link to="/app/courses">
              View My Courses
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
        description="Open a joined course to browse its topics and published resources."
        icon={BookOpen}
        title="Course materials"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {courses.slice(0, 4).map((course) => (
            <Link
              className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent"
              key={course.id}
              to={`/app/workspace/${course.id}`}
            >
              <p className="font-semibold">{course.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{course.courseCode} · {course.subject}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <p className="text-sm text-muted-foreground">
        Membership and publication states are represented in this frontend prototype; joining and publishing controls come next.
      </p>
    </PageShell>
  )
}

export default DashboardPage
