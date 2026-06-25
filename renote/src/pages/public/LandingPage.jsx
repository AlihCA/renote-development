import { Link } from "react-router"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

function LandingPage() {
  return (
    <section className="hero-bg border-b">
      <div className="renote-container grid min-h-[calc(100svh-8rem)] items-center py-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" />
            Academic resource workspace
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              ReNote
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A clean academic workspace for organizing repositories, managing
              learning materials, and reviewing content with AI-assisted
              summaries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/role-selection">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore-public">Explore Public Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
