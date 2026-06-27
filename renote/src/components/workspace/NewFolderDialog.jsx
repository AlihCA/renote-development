import { useEffect, useMemo, useState } from "react"
import { FolderPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MAX_FOLDER_DEPTH = 5

function normalizeParentId(parentId, folders) {
  if (!parentId || parentId === "root") {
    return "root"
  }

  return folders.some((folder) => folder.id === parentId) ? parentId : "root"
}

function NewFolderDialog({
  children,
  defaultParentId = "root",
  folders,
  onCreateFolder,
  onOpenChange,
  open,
  showDefaultTrigger = true,
}) {
  const [folderName, setFolderName] = useState("")
  const [parentId, setParentId] = useState(() =>
    normalizeParentId(defaultParentId, folders)
  )
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === "boolean"
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen
  const selectedParent = useMemo(
    () => folders.find((folder) => folder.id === parentId),
    [folders, parentId]
  )
  const nextDepth = selectedParent ? selectedParent.depth + 1 : 0
  const displayDepth = nextDepth + 1
  const isDepthLimitExceeded = displayDepth > MAX_FOLDER_DEPTH

  useEffect(() => {
    if (isOpen) {
      setParentId(normalizeParentId(defaultParentId, folders))
    }
  }, [defaultParentId, folders, isOpen])

  function handleSubmit(event) {
    event.preventDefault()

    if (!folderName.trim() || isDepthLimitExceeded) {
      return
    }

    onCreateFolder({
      name: folderName.trim(),
      parentId: parentId === "root" ? null : parentId,
    })
    setFolderName("")
    setParentId("root")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : showDefaultTrigger ? (
        <DialogTrigger asChild>
          <Button size="sm" type="button" variant="outline">
            <FolderPlus className="size-4" />
            New Folder
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="gap-7 border-[#E9C8F2]/80 bg-popover p-6 sm:max-w-lg sm:p-7 dark:border-primary/20">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Create a prototype folder inside the current repository workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Folder name
            </span>
            <Input
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="e.g. Chapter 2"
              required
              value={folderName}
            />
            <span className="block px-1 text-xs leading-5 text-muted-foreground">
              Use a clear academic section name, such as Chapter 1 or
              Presentations.
            </span>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Parent folder
            </span>
            <Select onValueChange={setParentId} value={parentId}>
              <SelectTrigger className="w-full border-border bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root level</SelectItem>
                {folders.map((folder) => (
                  <SelectItem
                    disabled={folder.depth >= MAX_FOLDER_DEPTH - 1}
                    key={folder.id}
                    value={folder.id}
                  >
                    {"- ".repeat(folder.depth)}
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="block px-1 text-xs leading-5 text-muted-foreground">
              {selectedParent
                ? `New folder will be created inside ${selectedParent.name}.`
                : "New folder will be created at the root level."}
            </span>
          </label>

          <div className="rounded-2xl border border-[#E9C8F2]/70 bg-[#FCF7FF] p-4 dark:border-primary/20 dark:bg-primary/5">
            <p className="text-sm font-medium">
              Depth {displayDepth} of {MAX_FOLDER_DEPTH}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {isDepthLimitExceeded
                ? "This parent is already at the maximum folder depth."
                : "Nested folders can go up to five levels deep in this prototype."}
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isDepthLimitExceeded} type="submit">
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewFolderDialog
