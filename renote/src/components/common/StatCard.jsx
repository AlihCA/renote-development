import { ArrowUpRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const variants = {
  default: "renote-card",
  glow: "renote-card renote-glow",
  muted: "renote-muted-card",
}

const iconVariants = {
  default: "renote-icon-container",
  glow: "renote-icon-container renote-icon-container-glow",
  muted: "renote-icon-container",
}

function StatCard({
  className,
  description,
  icon: Icon,
  title,
  trend,
  value,
  variant = "default",
}) {
  return (
    <Card className={cn(variants[variant], className)}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
        </div>
        {Icon ? (
          <span className={iconVariants[variant]}>
            <Icon className="size-5" />
          </span>
        ) : null}
      </CardHeader>
      {(description || trend) ? (
        <CardContent className="space-y-2">
          {trend ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <ArrowUpRight className="size-3" />
              {trend}
            </span>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  )
}

export default StatCard
