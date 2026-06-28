import { Link } from "react-router"
import { ArrowRight, Compass, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function HeroSection() {
  return (
    <section className="hero-bg scroll-mt-20 border-b" id="hero">
      <div className="renote-container flex min-h-[calc(100svh-10rem)] items-center py-14 sm:py-16 lg:min-h-[620px] lg:py-20">
        <div className="max-w-3xl space-y-7">
          <Badge
            className="gap-2 rounded-2xl border-primary/20 bg-background/85 px-3 py-1.5 text-primary shadow-sm backdrop-blur"
            variant="outline"
          >
            <Sparkles className="size-3.5" />
            Academic resource workspace
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              ReNote
            </h1>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Organize academic resources without the overload.
            </p>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              ReNote helps students and educators manage repositories, organize
              learning materials, and review academic content with AI-assisted
              summaries.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="renote-gradient-button border-transparent hover:text-white"
              size="lg"
            >
              <Link to="/sign-up">
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

export default HeroSection
