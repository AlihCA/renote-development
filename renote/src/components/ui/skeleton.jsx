import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-2xl bg-primary/10 dark:bg-muted/70",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
