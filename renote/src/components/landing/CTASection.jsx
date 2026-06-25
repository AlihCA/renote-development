import { Link } from "react-router"
import { ArrowRight, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"

function CTASection() {
  return (
    <section className="scroll-mt-20 bg-background" id="cta">
      <div className="renote-container py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start organizing academic resources with ReNote.
            </h2>
            <p className="text-muted-foreground">
              Bring repositories, folders, summaries, collections, and access
              workflows into one clean academic workspace.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="renote-gradient-button border-transparent hover:text-white"
              size="lg"
            >
              <Link to="/role-selection">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore-public">
                <Compass className="size-4" />
                Explore Public Resources
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
