import { Link } from "react-router"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

function DashboardRecentCard({ children, icon: Icon, title, to, viewAllLabel = "View all" }) {
  return (
    <section className="renote-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {Icon ? (
            <span className="renote-icon-container size-10">
              <Icon className="size-5" />
            </span>
          ) : null}
          <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
        </div>

        <Button asChild size="sm" variant="secondary">
          <Link to={to}>
            {viewAllLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3">{children}</div>
    </section>
  )
}

export default DashboardRecentCard
