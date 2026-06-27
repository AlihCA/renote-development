import { useState } from "react"
import { FolderPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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

function NewFolderDialog({ children, folders, onCreateFolder }) {
  const [folderName, setFolderName] = useState("")
  const [parentId, setParentId] = useState("root")
  const [isOpen, setIsOpen] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    if (!folderName.trim()) {
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
      <DialogTrigger asChild>
        {children ?? (
          <Button size="sm" type="button" variant="outline">
            <FolderPlus className="size-4" />
            New Folder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Create a prototype folder in this repository workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                  <SelectItem key={folder.id} value={folder.id}>
                    {"- ".repeat(folder.depth)}
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <DialogFooter>
            <Button type="submit">Create folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewFolderDialog
