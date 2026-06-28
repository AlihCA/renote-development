import { Search, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const searchModes = [
  {
    icon: Search,
    label: "Keyword",
    value: "keyword",
  },
  {
    icon: Sparkles,
    label: "Semantic",
    value: "semantic",
  },
]

function SearchModeControl({ className, mode, onModeChange }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="inline-flex w-full rounded-2xl border border-[#E9C8F2]/80 bg-background/90 p-1 shadow-sm sm:w-auto dark:border-primary/20">
        {searchModes.map((item) => {
          const Icon = item.icon
          const isActive = mode === item.value

          return (
            <Button
              aria-pressed={isActive}
              className={cn(
                "flex-1 shadow-none sm:flex-none",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-[var(--renote-primary-hover)] hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={item.value}
              onClick={() => onModeChange(item.value)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          )
        })}
      </div>

      {mode === "semantic" ? (
        <p className="max-w-sm text-xs leading-5 text-muted-foreground">
          Search by meaning, topic, or natural language question.
        </p>
      ) : null}
    </div>
  )
}

export default SearchModeControl
