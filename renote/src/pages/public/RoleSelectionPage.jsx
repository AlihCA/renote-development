import { Link, useNavigate } from "react-router"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useApplicationUser from "@/hooks/useApplicationUser"
import { APP_ROLES } from "@/lib/roles"

const roles = [
  {
    buttonLabel: "Open student preview",
    description:
      "Find faculty-provided course materials and review available resources.",
    icon: GraduationCap,
    identity: "Learner",
    name: "Student",
    note: "Student access will follow course membership in the revised platform.",
    value: APP_ROLES.STUDENT,
  },
  {
    buttonLabel: "Open faculty preview",
    description:
      "Organize course materials for students in a faculty-managed workspace.",
    icon: BookOpen,
    identity: "Course manager",
    name: "Faculty",
    note: "Faculty course management and publishing controls are planned for a later step.",
    value: APP_ROLES.FACULTY,
  },
  {
    buttonLabel: "Open admin preview",
    description: "Preview the future space for managing users, content, and platform usage.",
    icon: ShieldCheck,
    identity: "Platform manager",
    name: "Admin",
    note: "Admin controls are planned for a later step; this selection is a local demo setting.",
    value: APP_ROLES.ADMIN,
  },
]

function RoleCard({ isCurrent, onSelect, role }) {
  const Icon = role.icon

  return (
    <article className="renote-card flex h-full flex-col gap-5 p-5 transition-colors hover:border-primary/30 hover:bg-accent dark:hover:bg-primary/5">
      <div className="flex items-start gap-3">
        <span className="renote-icon-container text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 space-y-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            {role.name}
            {isCurrent ? <Badge variant="secondary">Current</Badge> : null}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {role.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-primary/15 bg-accent/60 p-4 dark:bg-primary/5">
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

      <Button className="mt-auto w-full" onClick={() => onSelect(role.value)} type="button">
        {role.buttonLabel}
        <ArrowRight className="size-4" />
      </Button>
    </article>
  )
}

function RoleSelectionPage() {
  const navigate = useNavigate()
  const { appUser, setPrototypeRole } = useApplicationUser()

  function selectRole(role) {
    setPrototypeRole(role)
    navigate("/app/dashboard")
  }

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
              Prototype role preview
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Preview ReNote by role
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Select Student, Faculty, or Admin to preview the frontend workspace.
              </p>
            </div>

            <p className="mx-auto max-w-xl rounded-xl border border-primary/20 bg-accent/60 px-4 py-3 text-sm text-muted-foreground dark:bg-primary/5">
              Demo only: selection is saved in this browser for your signed-in account. It does not verify or grant production access.
            </p>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <RoleCard
              isCurrent={appUser?.role === role.value}
              key={role.value}
              onSelect={selectRole}
              role={role}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/15 bg-accent/60 p-5 text-center shadow-sm dark:bg-primary/5 sm:flex-row sm:text-left">
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
