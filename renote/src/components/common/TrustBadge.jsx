import { ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const trustStyles = {
  community: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  official: "bg-primary/10 text-primary",
  trusted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  verified: "bg-primary/10 text-primary",
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
      className={cn("gap-1", trustStyles[key] ?? trustStyles.verified, className)}
      variant="secondary"
    >
      <Icon className="size-3" />
      {children ?? "Verified"}
    </Badge>
  )
}

export default TrustBadge
