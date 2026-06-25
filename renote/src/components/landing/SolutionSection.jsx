import { Bot, FolderOpen, Play, ShieldCheck, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"

function SolutionSection() {
  return (
    <section className="scroll-mt-20 border-y bg-muted/35" id="solution">
      <div className="renote-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            The ReNote approach
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A smarter workspace for academic resources.
          </h2>
          <p className="text-muted-foreground">
            ReNote combines repository organization with AI-assisted review
            tools, so students and educators can spend less time hunting for
            materials and more time understanding them.
          </p>
        </div>

        <div className="renote-card overflow-hidden p-4 sm:p-5">
          {/* Later, replace this placeholder with /videos/renote-infomercial.mp4. */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border bg-[linear-gradient(135deg,#fbf7ff_0%,#f8d7ff_42%,#e8dcff_100%)] dark:bg-[linear-gradient(135deg,#24102f_0%,#3b1850_52%,#201a3f_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255_/_58%),transparent_30%),radial-gradient(circle_at_80%_72%,rgb(180_59_209_/_18%),transparent_34%)] dark:bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255_/_10%),transparent_30%),radial-gradient(circle_at_80%_72%,rgb(216_94_219_/_24%),transparent_34%)]" />
            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge
                    className="gap-1.5 rounded-2xl bg-background/80 text-primary shadow-sm backdrop-blur"
                    variant="outline"
                  >
                    <Sparkles className="size-3.5" />
                    Video preview
                  </Badge>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      ReNote Infomercial
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      A short walkthrough of how repositories, folders, AI
                      summaries, collections, and trust labels work together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid place-items-center py-4">
                <button
                  aria-label="Preview ReNote infomercial"
                  className="grid size-20 place-items-center rounded-3xl border border-white/70 bg-white/85 text-primary shadow-[0_18px_45px_rgb(180_59_209_/_24%)] backdrop-blur transition hover:scale-105 hover:text-[var(--renote-primary-hover)] dark:border-white/15 dark:bg-background/75"
                  type="button"
                >
                  <Play className="ml-1 size-8 fill-current" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <FolderOpen className="size-3.5 text-primary" />
                  Repository flow
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <Bot className="size-3.5 text-primary" />
                  AI summary
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-2xl border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Trust labels
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionSection
