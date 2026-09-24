import { Link } from "react-router"
import { Archive, ArrowUpRight, BookOpen, FileText } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"

function FacultyDashboardPage() {
  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Manage your course spaces and the materials you share with students. Course editing and publishing arrive in a later step."
        title="Faculty Dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          action={
            <Button asChild size="sm" variant="outline">
              <Link to="/app/courses">
                Open My Courses
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          }
          description="View the sample course spaces currently shown in the prototype."
          icon={BookOpen}
          title="My Courses"
        />
        <SectionCard
          action={
            <Button asChild size="sm" variant="outline">
              <Link to="/app/materials">
                Open Materials
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          }
          description="Browse Draft and Published resources in courses you manage."
          icon={FileText}
          title="Materials"
        />
      </div>

      <Button asChild className="w-fit text-muted-foreground" size="sm" variant="ghost">
        <Link to="/app/archive">
          <Archive className="size-4" />
          Archive
        </Link>
      </Button>
    </PageShell>
  )
}

export default FacultyDashboardPage
