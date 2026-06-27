import { useState } from "react"

import {
  Dialog,
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

function UploadFileDialog({ children, folders, onUploadFile }) {
  const defaultFolderId = folders[0]?.id ?? "none"
  const [form, setForm] = useState({
    ...initialForm,
    folderId: defaultFolderId,
  })
  const [isOpen, setIsOpen] = useState(false)

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
      folderId: defaultFolderId,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Add a prototype file row to this repository. No real upload is
            performed yet.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              File name
            </span>
            <Input
              onChange={(event) => updateField("fileName", event.target.value)}
              placeholder="e.g. Review Notes.pdf"
              required
              value={form.fileName}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
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

            <label className="space-y-2">
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

          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Size label
            </span>
            <Input
              onChange={(event) => updateField("size", event.target.value)}
              placeholder="e.g. 2.4 MB"
              value={form.size}
            />
          </label>

          <DialogFooter>
            <Button type="submit">Add prototype file</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFileDialog
