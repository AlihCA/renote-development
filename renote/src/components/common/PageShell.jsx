import { cn } from "@/lib/utils"

const widths = {
  default: "max-w-7xl",
  narrow: "max-w-5xl",
  wide: "max-w-[88rem]",
}

function PageShell({ children, className, size = "default" }) {
  return (
    <section
      className={cn(
        "renote-container py-8 sm:py-10",
        widths[size] ?? widths.default,
        className
      )}
    >
      {children}
    </section>
  )
}

export default PageShell
