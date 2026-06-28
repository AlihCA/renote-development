import { useAuth } from "@clerk/clerk-react"
import { Navigate, useLocation } from "react-router"

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <main className="renote-page grid min-h-svh place-items-center bg-muted/30 p-5">
        <section className="renote-card flex w-full max-w-sm items-center gap-3 p-5">
          <span className="size-3 rounded-full bg-primary" />
          <div>
            <p className="font-medium">Opening your ReNote workspace</p>
            <p className="text-sm text-muted-foreground">
              Checking your session...
            </p>
          </div>
        </section>
      </main>
    )
  }

  if (!isSignedIn) {
    return <Navigate replace state={{ from: location }} to="/sign-in" />
  }

  return children
}

export default ProtectedRoute
