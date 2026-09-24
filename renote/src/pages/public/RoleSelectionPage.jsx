import { Link } from "react-router"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Home,
  Sparkles,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const roles = [
  {
    buttonLabel: "Open student preview",
    description:
      "Find faculty-provided course materials and review available resources.",
    href: "/app/dashboard",
    icon: GraduationCap,
    identity: "Learner",
    name: "Student",
    note: "Student access will follow course membership in the revised platform.",
  },
  {
    buttonLabel: "Open faculty preview",
    description:
      "Organize course materials for students in a faculty-managed workspace.",
    href: "/app/dashboard",
    icon: BookOpen,
    identity: "Course manager",
    name: "Faculty",
    note: "Faculty course management and publishing controls are planned for a later step.",
  },
]

function RoleCard({ role }) {
  const Icon = role.icon

  return (
    <article className="renote-card flex h-full flex-col gap-5 p-5 transition-colors hover:border-[#E9B8F2] hover:bg-[#FFF7FD] dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex items-start gap-3">
        <span className="renote-icon-container text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{role.name}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {role.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-primary/15 bg-[#FFF7FD] p-4 dark:bg-primary/5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Role identity
        </p>
        <div className="space-y-2">
          <Badge
            className="rounded-2xl border-primary/20 bg-background/85 text-primary"
            variant="outline"
          >
            {role.identity}
          </Badge>
          <p className="text-sm leading-6 text-muted-foreground">{role.note}</p>
        </div>
      </div>

      <Button asChild className="mt-auto w-full">
        <Link to={role.href}>
          {role.buttonLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </article>
  )
}

function RoleSelectionPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-muted/35">
        <PageShell className="py-12 sm:py-16" size="narrow">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge
              className="gap-2 rounded-2xl border-primary/20 bg-background/85 px-3 py-1.5 text-primary shadow-sm"
              variant="outline"
            >
              <Sparkles className="size-3.5" />
              Choose your workspace
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                How would you like to continue?
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Preview the student and faculty directions for course materials.
              </p>
            </div>

            <p className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-[#FCF5FF] px-4 py-3 text-sm text-muted-foreground dark:bg-primary/5">
              This page is a prototype preview. Choosing a card does not assign or verify a role.
            </p>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-primary/15 bg-[#FFF7FD] p-5 text-center shadow-sm dark:bg-primary/5 sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h2 className="font-semibold">Not sure where to start?</h2>
            <p className="text-sm text-muted-foreground">
              You can return to the landing page before opening the workspace.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </PageShell>
    </div>
  )
}

export default RoleSelectionPage
