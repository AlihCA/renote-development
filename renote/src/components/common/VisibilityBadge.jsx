import { Eye, EyeOff, Lock, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const visibilityConfig = {
  private: {
    Icon: Lock,
    className: "bg-muted text-muted-foreground",
    label: "Private",
  },
  public: {
    Icon: Eye,
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    label: "Public",
  },
  restricted: {
    Icon: Users,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    label: "Restricted",
  },
  unlisted: {
    Icon: EyeOff,
    className: "bg-secondary text-secondary-foreground",
    label: "Unlisted",
  },
}

function VisibilityBadge({ children, className, visibility = "private" }) {
  const config =
    visibilityConfig[String(visibility).toLowerCase()] ?? visibilityConfig.private
  const Icon = config.Icon

  return (
    <Badge
      className={cn("gap-1", config.className, className)}
      variant="secondary"
    >
      <Icon className="size-3" />
      {children ?? config.label}
    </Badge>
  )
}

export default VisibilityBadge
