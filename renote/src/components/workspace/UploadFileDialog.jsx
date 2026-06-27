import { useEffect, useState } from "react"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialForm = {
  extension: "pdf",
  fileName: "",
  folderId: "",
  size: "Prototype file",
}

function normalizeFolderId(folderId, folders) {
  if (!folderId || folderId === "none") {
    return "none"
  }

  return folders.some((folder) => folder.id === folderId) ? folderId : "none"
}

function UploadFileDialog({
  children,
  defaultFolderId = "none",
  folders,
  onOpenChange,
  onUploadFile,
  open,
}) {
  const resolvedDefaultFolderId = normalizeFolderId(defaultFolderId, folders)
  const [form, setForm] = useState({
    ...initialForm,
    folderId: resolvedDefaultFolderId,
  })
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === "boolean"
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...initialForm,
        folderId: resolvedDefaultFolderId,
      })
    }
  }, [isOpen, resolvedDefaultFolderId])

  function updateField(key, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.fileName.trim()) {
      return
    }

    onUploadFile({
      ...form,
      fileName: form.fileName.trim(),
      folderId: form.folderId === "none" ? null : form.folderId,
    })
    setForm({
      ...initialForm,
      folderId: resolvedDefaultFolderId,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="gap-0 overflow-hidden border-[#E9C8F2]/80 bg-popover p-0 sm:max-w-2xl dark:border-primary/20">
        <DialogHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Add a prototype file row to this repository. No real upload is
            performed yet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 pb-6 pt-5 sm:px-7">
            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                File name
              </span>
              <Input
                onChange={(event) => updateField("fileName", event.target.value)}
                placeholder="e.g. Review Notes.pdf"
                required
                value={form.fileName}
              />
              <span className="block px-1 text-xs leading-5 text-muted-foreground">
                Add the display name students will see in the file manager.
              </span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="px-1 text-xs font-medium text-muted-foreground">
                  Type
                </span>
                <Select
                  onValueChange={(value) => updateField("extension", value)}
                  value={form.extension}
                >
                  <SelectTrigger className="w-full border-border bg-background/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Document</SelectItem>
                    <SelectItem value="pptx">Presentation</SelectItem>
                    <SelectItem value="xlsx">Spreadsheet</SelectItem>
                    <SelectItem value="png">Image</SelectItem>
                    <SelectItem value="url">Link</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-1.5">
                <span className="px-1 text-xs font-medium text-muted-foreground">
                  Folder
                </span>
                <Select
                  onValueChange={(value) => updateField("folderId", value)}
                  value={form.folderId}
                >
                  <SelectTrigger className="w-full border-border bg-background/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No folder</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {"- ".repeat(folder.depth)}
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="space-y-1.5">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Size label
              </span>
              <Input
                onChange={(event) => updateField("size", event.target.value)}
                placeholder="e.g. 2.4 MB"
                value={form.size}
              />
              <span className="block px-1 text-xs leading-5 text-muted-foreground">
                Use a readable prototype label, such as 2.4 MB or External link.
              </span>
            </label>
          </div>

          <DialogFooter className="border-t border-[#E9C8F2]/70 px-6 py-4 sm:px-7 dark:border-primary/20">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Prototype File</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFileDialog
