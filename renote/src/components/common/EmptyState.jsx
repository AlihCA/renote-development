import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"

function EmptyState({
  action,
  children,
  className,
  description,
  icon: Icon = Inbox,
  title = "Nothing here yet",
}) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center",
        className
      )}
    >
      <span className="renote-icon-container mb-4 size-12">
        <Icon className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export default EmptyState
