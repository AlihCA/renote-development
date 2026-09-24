import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-lg bg-muted dark:bg-muted/70",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
