import { Link } from "react-router"
import {
  Bell,
  BookOpen,
  Bot,
  Building2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  FolderOpen,
  GraduationCap,
  KeyRound,
  Layers,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react"

import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Keep readings, notes, links, and review materials organized by class, topic, or study goal.",
  },
  {
    icon: BookOpen,
    title: "Faculty",
    description:
      "Share trusted learning materials, guide resource quality, and help students review content more clearly.",
  },
  {
    icon: Building2,
    title: "Institutions",
    description:
      "Support a cleaner academic resource space with controlled access, visibility labels, and organized repositories.",
  },
  {
    icon: Users,
    title: "Guests / public users",
    description:
      "Browse public repositories before signing in and discover resources that are open for academic use.",
  },
]

const workflowSteps = [
  {
    icon: Library,
    title: "Create or browse repositories",
    description:
      "Start from a shared academic repository or create a focused space for a class, project, or topic.",
  },
  {
    icon: FolderOpen,
    title: "Organize files using folders and tags",
    description:
      "Group readings, documents, links, and media into a structure that stays easy to scan.",
  },
  {
    icon: Bot,
    title: "Review materials with AI summaries",
    description:
      "Use AI-assisted summaries as a study aid for key ideas, review notes, and learning prompts.",
  },
  {
    icon: Layers,
    title: "Save resources into collections",
    description:
      "Build study boards for reports, exams, research topics, or curated learning paths.",
  },
  {
    icon: Bell,
    title: "Manage access and notifications",
    description:
      "Request protected materials, track updates, and stay aware of repository activity.",
  },
]

const features = [
  {
    icon: Library,
    title: "Repository Management",
    description:
      "Create organized academic spaces for course modules, research references, and shared learning materials.",
  },
  {
    icon: FolderOpen,
    title: "Nested Folders",
    description:
      "Arrange files and links into folder structures that match how students naturally study.",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    description:
      "Generate study-friendly summaries to help users review long materials with more focus.",
  },
  {
    icon: Clock3,
    title: "Summary History",
    description:
      "Return to previous summaries and keep a review trail for academic materials.",
  },
  {
    icon: Layers,
    title: "Collections / Study Boards",
    description:
      "Save selected resources into focused boards for exams, reports, and class preparation.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Labels",
    description:
      "Show whether a resource is community-contributed, faculty-reviewed, or official.",
  },
  {
    icon: KeyRound,
    title: "Access Requests",
    description:
      "Let users request restricted materials while keeping private resources controlled.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Surface repository updates, access activity, and review events in one simple place.",
  },
]

const faqs = [
  {
    question: "What is a repository?",
    answer:
      "A repository is a shared academic space for related learning materials, such as readings, files, links, folders, summaries, and tags.",
  },
  {
    question: "Can guests browse resources?",
    answer:
      "Yes. Guests can browse public repositories and previews, while actions like saving, summarizing, or requesting access are guided toward signing in.",
  },
  {
    question: "Why are some resources restricted?",
    answer:
      "Some materials may be intended for a specific class, faculty group, or institution. Restricted visibility helps protect those resources while still making their context understandable.",
  },
  {
    question: "What are trust labels?",
    answer:
      "Trust labels communicate source quality. They help users understand whether a resource is community-contributed, faculty-reviewed, or official.",
  },
  {
    question: "Can AI summaries replace reading the full material?",
    answer:
      "No. AI-assisted summaries are designed to support review and comprehension, not replace the original academic material or the user's own reading.",
  },
  {
    question: "Will ReNote support private repositories?",
    answer:
      "Yes. The prototype includes visibility concepts for public, restricted, and private resources so future repository workflows can support controlled access.",
  },
]

function HelpAboutPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-muted/35">
        <PageShell className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.55fr)] lg:items-center">
          <div className="max-w-3xl space-y-6">
            <Badge
              className="gap-2 rounded-2xl border-primary/20 bg-background/85 px-3 py-1.5 text-primary shadow-sm"
              variant="outline"
            >
              <CircleHelp className="size-3.5" />
              About ReNote
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                A calmer way to manage academic resources.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                ReNote is a web-based academic repository designed to help
                students and educators organize learning materials, browse
                trusted resources, and review content through AI-assisted
                summaries.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/role-selection">
                  Get Started
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/explore-public">Explore Public Resources</Link>
              </Button>
            </div>
          </div>

          <div className="renote-card space-y-4 p-5">
            <div className="flex items-center gap-3">
              <span className="renote-icon-container text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">What ReNote brings together</h2>
                <p className="text-sm text-muted-foreground">
                  Resource organization, review support, and controlled sharing.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-2xl border bg-background/75 px-3 py-2">
                <Search className="size-4 text-primary" />
                Browse trusted public resources
              </div>
              <div className="flex items-center gap-2 rounded-2xl border bg-background/75 px-3 py-2">
                <Tags className="size-4 text-primary" />
                Organize materials with folders and tags
              </div>
              <div className="flex items-center gap-2 rounded-2xl border bg-background/75 px-3 py-2">
                <Bot className="size-4 text-primary" />
                Review content with AI-assisted summaries
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Who it helps
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for academic communities that need less clutter.
          </h2>
          <p className="text-muted-foreground">
            ReNote supports different users without making the workspace feel
            complicated.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => (
            <SectionCard
              className="h-full"
              description={audience.description}
              icon={audience.icon}
              key={audience.title}
              title={audience.title}
            />
          ))}
        </div>
      </PageShell>

      <section className="border-y bg-muted/25">
        <PageShell className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              How ReNote works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A simple flow from resource discovery to review.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <div className="renote-card h-full space-y-4 p-5" key={step.title}>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="renote-icon-container">
                    <step.icon className="size-5" />
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Core features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            The main ReNote tools, explained simply.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <SectionCard
              className="h-full"
              description={feature.description}
              icon={feature.icon}
              key={feature.title}
              title={feature.title}
            />
          ))}
        </div>
      </PageShell>

      <section className="border-y bg-muted/25">
        <PageShell className="space-y-8" size="narrow">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Common questions about ReNote.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                className="group rounded-3xl border bg-card p-5 shadow-sm open:border-primary/25 open:bg-[#FFF7FD] dark:open:bg-primary/5"
                key={faq.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {faq.question}
                  <ChevronRight className="size-4 shrink-0 text-primary transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell className="pb-14 sm:pb-16" size="narrow">
        <div className="rounded-3xl border border-primary/20 bg-[#FCF5FF] p-6 text-center shadow-sm dark:bg-primary/5 sm:p-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <span className="mx-auto grid size-12 place-items-center rounded-3xl border border-primary/20 bg-background text-primary shadow-sm">
              <Compass className="size-6" />
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Ready to explore ReNote?
              </h2>
              <p className="text-muted-foreground">
                Start with the public library or choose a role to enter the
                academic workspace.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/role-selection">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/explore-public">Explore Public Resources</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}

export default HelpAboutPage
