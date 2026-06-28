import { useMemo, useState } from "react"
import { Link } from "react-router"
import { ArrowUpRight, Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const summaryTypes = ["Quick", "Detailed", "Key Points", "Study Guide"]

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function SummaryTypeButton({ isActive, onClick, type }) {
  return (
    <button
      className={cn(
        "h-11 rounded-2xl border px-3 text-sm font-medium transition-colors",
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
      )}
      onClick={onClick}
      type="button"
    >
      {type}
    </button>
  )
}

function AISummaryDrawer({
  folders,
  isOpen,
  onOpenChange,
  selectedFolderName,
  summaries,
}) {
  const [source, setSource] = useState("current")
  const [summaryType, setSummaryType] = useState("Quick")

  const recentSummaries = useMemo(
    () =>
      [...summaries]
        .sort(
          (first, second) =>
            new Date(second.generatedAt) - new Date(first.generatedAt)
        )
        .slice(0, 3),
    [summaries]
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="shrink-0 border-b px-6 py-6 text-left">
          <SheetTitle className="text-xl">AI Summary</SheetTitle>
          <SheetDescription className="max-w-sm text-sm leading-6">
            Generate prototype summaries from a selected file, folder, or the
            full repository.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <section className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="px-1 text-xs font-medium text-muted-foreground">
                    Source
                  </span>
                  <Select onValueChange={setSource} value={source}>
                    <SelectTrigger className="h-11 w-full rounded-2xl border-border bg-background/90">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">
                        {selectedFolderName}
                      </SelectItem>
                      <SelectItem value="all">All Files</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {"- ".repeat(folder.depth)}
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <div className="space-y-3">
                  <p className="px-1 text-xs font-medium text-muted-foreground">
                    Summary type
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {summaryTypes.map((type) => (
                      <SummaryTypeButton
                        isActive={summaryType === type}
                        key={type}
                        onClick={() => setSummaryType(type)}
                        type={type}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  className="h-11 w-full rounded-2xl"
                  onClick={() =>
                    toast(
                      `${summaryType} summary generation will be connected during backend integration.`
                    )
                  }
                  type="button"
                >
                  <Sparkles className="size-4" />
                  Generate Summary
                </Button>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold tracking-tight">
                    Recent Summaries
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {summaries.length} saved in this repository
                  </p>
                </div>

                <Button asChild size="icon-sm" variant="ghost">
                  <Link aria-label="View summary history" to="/app/summaries">
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>

              {recentSummaries.length > 0 ? (
                <div className="space-y-2.5">
                  {recentSummaries.map((summary) => (
                    <Link
                      className="block rounded-2xl border bg-card p-4 transition-colors hover:border-primary/25 hover:bg-primary/5"
                      key={summary.id}
                      to={`/app/summaries/${summary.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-1 text-sm font-semibold">
                          {summary.title}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(summary.generatedAt)}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {summary.preview}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  No summaries yet for this repository.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex gap-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Select a specific file or folder to generate a more focused
                  summary.
                </p>
              </div>
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AISummaryDrawer
