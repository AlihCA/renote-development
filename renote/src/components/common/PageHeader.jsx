import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function PageHeader({
  actions,
  children,
  className,
  description,
  eyebrow,
  icon: Icon,
  title,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b pb-7 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <Badge className="w-fit" variant="secondary">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="renote-icon-container size-11">
              <Icon className="size-5" />
            </span>
          ) : null}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {children}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export default PageHeader
