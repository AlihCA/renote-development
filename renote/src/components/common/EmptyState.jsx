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
        "flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed bg-background/60 px-6 py-10 text-center",
        className
      )}
    >
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
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
