import LandingVideoPreview from "@/components/landing/LandingVideoPreview"

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

        <LandingVideoPreview />
      </div>
    </section>
  )
}

export default SolutionSection
