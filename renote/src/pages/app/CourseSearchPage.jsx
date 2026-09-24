import { Link, useSearchParams } from "react-router"
import { ArrowUpRight, BookOpen, Search } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import ResourceCard from "@/components/course/ResourceCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { selectStudentSearch } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function CourseSearchPage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const results = selectStudentSearch(state, appUser, query)
  const coursesById = new Map(state.courses.map((course) => [course.id, course]))
  const topicsById = new Map(state.topics.map((topic) => [topic.id, topic]))

  function updateQuery(value) {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set("q", value)
    else next.delete("q")
    setSearchParams(next, { replace: true })
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Search your joined courses and their published materials by title, course code, subject, or file type."
        icon={Search}
        title="Search"
      />

      <label className="relative block max-w-xl">
        <span className="sr-only">Search joined courses and materials</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" onChange={(event) => updateQuery(event.target.value)} placeholder="Search courses or materials" type="search" value={query} />
      </label>

      {results.courses.length || results.resources.length ? (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Courses</h2>
            {results.courses.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {results.courses.map((course) => (
                  <Link className="renote-card group flex items-center gap-3 p-4 hover:border-primary/30 hover:bg-accent/50" key={course.id} to={`/app/workspace/${course.id}`}>
                    <span className="renote-icon-container"><BookOpen className="size-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium group-hover:text-primary">{course.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{course.subject}</span>
                    </span>
                    <Badge variant="outline">{course.courseCode}</Badge>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No matching courses.</p>}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Published resources</h2>
            {results.resources.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {results.resources.map((resource) => (
                  <ResourceCard course={coursesById.get(resource.courseId)} key={resource.id} resource={resource} topic={topicsById.get(resource.topicId)} />
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No matching published resources.</p>}
          </section>
        </div>
      ) : (
        <EmptyState description="Try a course title, code, subject, resource title, or file type." icon={Search} title="No results found" />
      )}
    </PageShell>
  )
}

export default CourseSearchPage
