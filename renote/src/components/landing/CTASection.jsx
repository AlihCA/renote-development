import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

function CTASection() {
  return (
    <section className="scroll-mt-20 bg-background" id="cta">
      <div className="renote-container py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Keep course materials easy to find with ReNote.
            </h2>
            <p className="text-muted-foreground">
              A focused workspace for faculty materials and student learning.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
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
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
