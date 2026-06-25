import { Eye, EyeOff, Lock, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const visibilityConfig = {
  private: {
    Icon: Lock,
    className: "border-border/80 bg-muted text-muted-foreground dark:bg-muted/60",
    label: "Private",
  },
  public: {
    Icon: Eye,
    className:
      "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
    label: "Public",
  },
  restricted: {
    Icon: Users,
    className:
      "border-amber-200/90 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
    label: "Restricted",
  },
  unlisted: {
    Icon: EyeOff,
    className: "border-primary/15 bg-primary/10 text-primary",
    label: "Unlisted",
  },
}

function VisibilityBadge({ children, className, visibility = "private" }) {
  const config =
    visibilityConfig[String(visibility).toLowerCase()] ?? visibilityConfig.private
  const Icon = config.Icon

  return (
    <Badge
      className={cn("gap-1 shadow-none", config.className, className)}
      variant="secondary"
    >
      <Icon className="size-3" />
      {children ?? config.label}
    </Badge>
  )
}

export default VisibilityBadge
