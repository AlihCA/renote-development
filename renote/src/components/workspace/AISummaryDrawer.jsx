import { useState } from "react"
import { Lightbulb, Sparkles } from "lucide-react"
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

const summaryTypes = ["Quick", "Detailed", "Key Points", "Study Guide"]

function AISummaryDrawer({
  folders,
  isOpen,
  onOpenChange,
  selectedFolderName,
}) {
  const [source, setSource] = useState("current")
  const [summaryType, setSummaryType] = useState("Quick")

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="shrink-0 border-b px-6 py-6 text-left">
          <SheetTitle className="text-xl">AI Summary</SheetTitle>
          <SheetDescription className="max-w-sm text-sm leading-6">
            Preview summary options for course materials. Generation will be connected later.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Source</span>
            <Select onValueChange={setSource} value={source}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">{selectedFolderName}</SelectItem>
                <SelectItem value="all">All Files</SelectItem>
                {folders.filter((folder) => folder.depth === 0).map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Summary type</p>
            <div className="grid grid-cols-2 gap-2">
              {summaryTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setSummaryType(type)}
                  type="button"
                  variant={summaryType === type ? "secondary" : "outline"}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() =>
              toast("Summary generation will be connected during backend integration.")
            }
            type="button"
          >
            <Sparkles className="size-4" />
            Generate Summary
          </Button>

          <div className="flex gap-3 rounded-lg border bg-muted/50 p-4">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              Choose a file or material group for a focused summary preview.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AISummaryDrawer