import { Link } from "react-router"
import { ArrowUpRight, BookOpen, FileText, Search } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { mockFiles, mockRepositories } from "@/data"
import { APP_ROLES } from "@/lib/roles"

function DashboardPage() {
  const facultyMaterials = mockRepositories.filter(
    (repository) => repository.ownerRole === APP_ROLES.FACULTY && repository.status === "active"
  )
  const facultyRepositoryIds = new Set(facultyMaterials.map((repository) => repository.id))
  const resourceCount = mockFiles.filter((file) =>
    facultyRepositoryIds.has(file.repositoryId)
  ).length

  return (
    <PageShell className="space-y-7">
      <PageHeader
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/app/search"><Search className="size-4" />Search materials</Link>
          </Button>
        }
        description="Find your course spaces and faculty-provided learning materials at PUP Parañaque. Course membership will be connected later."
        title="Student Dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionCard icon={BookOpen} title="Sample courses">
          <p className="text-2xl font-semibold">{facultyMaterials.length}</p>
          <p className="mt-1 text-muted-foreground">Faculty course spaces in this prototype</p>
        </SectionCard>
        <SectionCard icon={FileText} title="Available resources">
          <p className="text-2xl font-semibold">{resourceCount}</p>
          <p className="mt-1 text-muted-foreground">Files and links in these spaces</p>
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
        description="Browse sample materials organized by faculty."
        icon={BookOpen}
        title="Course materials"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {facultyMaterials.slice(0, 4).map((repository) => (
            <Link
              className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent"
              key={repository.id}
              to={`/app/workspace/${repository.id}`}
            >
              <p className="font-semibold">{repository.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{repository.subject}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {repository.description}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <p className="text-sm text-muted-foreground">
        Course membership, publishing, and faculty editing are planned for a later step.
      </p>
    </PageShell>
  )
}

export default DashboardPage
