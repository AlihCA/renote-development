import { Link } from "react-router"
import {
  ArrowRight,
  BookOpen,
  Building2,
  Compass,
  GraduationCap,
  Home,
  Sparkles,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const roles = [
  {
    buttonLabel: "Continue as Student",
    description:
      "Create repositories, organize class materials, browse resources, and review academic summaries.",
    href: "/app/dashboard",
    icon: GraduationCap,
    identity: "Community contributor",
    name: "Student",
    note: "Student-created resources help classmates discover reviewers, notes, and shared learning materials.",
  },
  {
    buttonLabel: "Continue as Faculty",
    description:
      "Create repositories and share academic resources with stronger credibility through faculty trust labels.",
    href: "/app/dashboard",
    icon: BookOpen,
    identity: "Faculty trusted source",
    name: "Faculty",
    note: "Faculty labels help users identify learning materials shared by verified academic contributors.",
  },
  {
    buttonLabel: "Continue as Institution",
    description:
      "Publish official repositories and maintain trusted institutional academic materials.",
    href: "/app/dashboard",
    icon: Building2,
    identity: "Official institutional source",
    name: "Institution",
    note: "Institution labels help highlight official resources, verified references, and school-published materials.",
  },
  {
    buttonLabel: "Explore as Guest",
    description:
      "Explore public academic resources before creating an account.",
    href: "/explore-public",
    icon: Compass,
    identity: "Public browsing only",
    name: "Guest",
    note: "Guests can browse public repositories, while creating, saving, and requesting access require signing in.",
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
                Select a role to preview how ReNote uses badges and trust labels to support different users 
                in creating, browsing, and reviewing academic resources.
              </p>
            </div>

            <p className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-[#FCF5FF] px-4 py-3 text-sm text-muted-foreground dark:bg-primary/5">
              This is a prototype role preview. Roles are used to show trust labels and credibility levels. Full role verification will be connected later.
            </p>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-primary/15 bg-[#FFF7FD] p-5 text-center shadow-sm dark:bg-primary/5 sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h2 className="font-semibold">Not sure where to start?</h2>
            <p className="text-sm text-muted-foreground">
              You can return home or browse the public academic library first.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore-public">Explore Public Resources</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    </div>
  )
}

export default RoleSelectionPage
