import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  archived: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
  draft: "bg-secondary text-secondary-foreground",
  muted: "bg-muted text-muted-foreground",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rejected: "bg-destructive/10 text-destructive",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
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
      className={cn(statusStyles[key] ?? statusStyles.muted, className)}
      variant="secondary"
    >
      {children ?? toLabel(status)}
    </Badge>
  )
}

export default StatusBadge
