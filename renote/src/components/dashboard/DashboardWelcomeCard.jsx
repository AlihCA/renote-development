import { FileText, FolderOpen, Sparkles } from "lucide-react"

function DashboardWelcomeCard({ actions }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,#D85EDB_0%,#B43BD1_48%,#8B5CF6_100%)] p-6 text-white shadow-lg dark:border-white/10 dark:bg-[linear-gradient(135deg,#24102F_0%,#48146E_52%,#8740A3_100%)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/60 to-white/0" />
      <div className="pointer-events-none absolute -right-12 top-8 hidden h-28 w-52 rotate-6 rounded-[2rem] border border-white/15 md:block" />
      <div className="pointer-events-none absolute bottom-8 right-20 hidden h-16 w-28 -rotate-6 rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm md:grid md:place-items-center">
        <FileText className="size-7 text-white/80" />
      </div>
      <div className="pointer-events-none absolute right-7 top-7 hidden h-20 w-32 rotate-3 rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm md:grid md:place-items-center">
        <FolderOpen className="size-8 text-white/85" />
      </div>
      <Sparkles className="pointer-events-none absolute right-10 top-32 hidden size-5 text-white/70 md:block" />
      <Sparkles className="pointer-events-none absolute bottom-7 right-48 hidden size-4 text-white/60 lg:block" />

      <div className="relative flex max-w-5xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Workspace overview
          </span>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back, ReNote User {"\u{1F44B}"}
            </h2>
            <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              Here's a quick snapshot of your academic workspace.
            </p>
          </div>
        </div>
        {actions ? (
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">{actions}</div>
        ) : null}
      </div>
    </section>
  )
}

export default DashboardWelcomeCard
