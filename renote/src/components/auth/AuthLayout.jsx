import { Link } from "react-router"
import { ArrowLeft } from "lucide-react"

function AuthLayout({ children }) {
  return (
    <main className="hero-bg relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px] dark:bg-[#1B1126]/45" />

      <Link
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/85 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:border-primary/35 hover:text-primary sm:left-6 sm:top-6"
        to="/"
      >
        <ArrowLeft className="size-4" />
        Back to landing page
      </Link>

      <div className="relative z-10 flex min-h-svh items-center justify-center px-4 py-8 sm:px-6">
        <div className="flex w-full max-w-[30rem] flex-col items-center gap-5">
          <Link
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/85 px-3 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition hover:border-primary/35 hover:text-primary"
            to="/"
          >
            <span className="grid size-8 place-items-center rounded-2xl bg-primary text-primary-foreground">
              R
            </span>
            ReNote
          </Link>

          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout