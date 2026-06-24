import { Link } from "react-router"

import { Button } from "@/components/ui/button"

function NotFoundPage() {
  return (
    <main className="renote-page grid place-items-center px-4 py-16">
      <section className="renote-card max-w-lg space-y-4 p-8 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          This route is not part of the Phase 0 ReNote foundation.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </section>
    </main>
  )
}

export default NotFoundPage
