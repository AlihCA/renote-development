import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const trustStyles = {
  community:
    "border-sky-200/90 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
  official: "border-primary/15 bg-primary/10 text-primary",
  trusted:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  verified: "border-primary/15 bg-primary/10 text-primary",
}

function TrustBadge({
  children,
  className,
  icon: Icon = ShieldCheck,
  level = "verified",
}) {
  const key = String(level).toLowerCase()

  return (
    <Badge
      className={cn(
        "gap-1 shadow-none",
        trustStyles[key] ?? trustStyles.verified,
        className
      )}
      variant="secondary"
    >
      <Icon className="size-3" />
      {children ?? "Verified"}
    </Badge>
  )
}

export default TrustBadge
