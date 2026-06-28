import { useEffect } from "react"
import { ClerkProvider } from "@clerk/clerk-react"
import { Link, useNavigate } from "react-router"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function MissingClerkKey() {
  return (
    <main className="renote-page grid min-h-svh place-items-center bg-muted/30 p-5">
      <section className="renote-card max-w-lg space-y-4 p-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
          <AlertTriangle className="size-6" />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Clerk is not configured yet.
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Add your Clerk publishable key to VITE_CLERK_PUBLISHABLE_KEY in the
            local environment file, then restart the dev server.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </section>
    </main>
  )
}

function ReNoteClerkProvider({ children }) {
  const navigate = useNavigate()

  function navigateWithRouter(to, options) {
    if (/^https?:\/\//.test(to)) {
      window.location.assign(to)
      return
    }

    navigate(to, options)
  }

  useEffect(() => {
    if (!publishableKey) {
      console.warn(
        "Missing VITE_CLERK_PUBLISHABLE_KEY. ReNote auth pages need a Clerk publishable key."
      )
    }
  }, [])

  if (!publishableKey) {
    return <MissingClerkKey />
  }

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      publishableKey={publishableKey}
      routerPush={(to) => navigateWithRouter(to)}
      routerReplace={(to) => navigateWithRouter(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  )
}

export default ReNoteClerkProvider
