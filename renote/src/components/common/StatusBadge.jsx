import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles = {
  active:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  approved:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  archived:
    "border-border/80 bg-muted text-muted-foreground dark:bg-muted/60",
  destructive:
    "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
  draft:
    "border-border bg-muted text-muted-foreground",
  muted: "border-border/80 bg-muted text-muted-foreground dark:bg-muted/60",
  pending:
    "border-amber-200/90 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  published:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  rejected: "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
  success:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  warning:
    "border-amber-200/90 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
}

function toLabel(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function StatusBadge({ children, className, status = "draft" }) {
  const key = String(status).toLowerCase().replace(/\s+/g, "-")

  return (
    <Badge
      className={cn("shadow-none", statusStyles[key] ?? statusStyles.muted, className)}
      variant="secondary"
    >
      {children ?? toLabel(status)}
    </Badge>
  )
}

export default StatusBadge
