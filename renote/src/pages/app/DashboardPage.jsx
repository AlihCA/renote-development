import { Link } from "react-router"
import { ArrowUpRight, BookOpen, FileText } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { mockFiles, mockRepositories } from "@/data"

function DashboardPage() {
  const facultyMaterials = mockRepositories.filter(
    (repository) => repository.ownerRole === "faculty" && repository.status === "active"
  )
  const facultyRepositoryIds = new Set(facultyMaterials.map((repository) => repository.id))
  const resourceCount = mockFiles.filter((file) =>
    facultyRepositoryIds.has(file.repositoryId)
  ).length

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="A preview of faculty-provided academic materials at PUP Parañaque."
        title="Workspace"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionCard icon={BookOpen} title="Faculty material spaces">
          <p className="text-2xl font-semibold">{facultyMaterials.length}</p>
          <p className="mt-1 text-muted-foreground">Sample spaces in this prototype</p>
        </SectionCard>
        <SectionCard icon={FileText} title="Available resources">
          <p className="text-2xl font-semibold">{resourceCount}</p>
          <p className="mt-1 text-muted-foreground">Files and links in these spaces</p>
        </SectionCard>
      </div>

      <SectionCard
        action={
          <Button asChild size="sm" variant="outline">
            <Link to="/app/my-repositories">
              View all materials
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
        description="Browse sample materials organized by faculty."
        icon={BookOpen}
        title="Faculty materials"
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