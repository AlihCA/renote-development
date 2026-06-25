import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

function SectionCard({
  action,
  children,
  className,
  description,
  footer,
  icon: Icon,
  title,
  variant = "default",
}) {
  return (
    <Card className={cn(variants[variant], className)}>
      {(title || description || Icon || action) ? (
        <CardHeader className="gap-3">
          <div className="flex items-start gap-3">
            {Icon ? (
              <span className={iconVariants[variant]}>
                <Icon className="size-5" />
              </span>
            ) : null}
            <div className="min-w-0 space-y-1">
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
          </div>
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      {children ? <CardContent className="text-sm">{children}</CardContent> : null}
      {footer ? <CardFooter className="text-sm">{footer}</CardFooter> : null}
    </Card>
  )
}

export default SectionCard
