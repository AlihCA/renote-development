import { useState } from "react"
import { Plus } from "lucide-react"

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

const initialForm = {
  allowAccessRequests: true,
  description: "",
  tags: "",
  title: "",
  visibility: "restricted",
}

function CreateRepositoryDialog({ onCreate }) {
  const [form, setForm] = useState(initialForm)
  const [isOpen, setIsOpen] = useState(false)

  function updateField(key, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    onCreate({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    setForm(initialForm)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Repository</DialogTitle>
          <DialogDescription>
            Add a prototype repository to your local ReNote workspace preview.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Repository title
            </span>
            <Input
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Software Engineering Reviewer"
              required
              value={form.title}
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Description
            </span>
            <textarea
              className="min-h-24 w-full rounded-3xl border bg-background/80 px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the academic materials in this repository."
              value={form.description}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Visibility
              </span>
              <Select
                onValueChange={(value) => updateField("visibility", value)}
                value={form.visibility}
              >
                <SelectTrigger className="w-full border-border bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="space-y-2">
              <span className="px-1 text-xs font-medium text-muted-foreground">
                Tags
              </span>
              <Input
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="research, reviewer, finals"
                value={form.tags}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-3xl border bg-background/70 p-3 text-sm">
            <input
              checked={form.allowAccessRequests}
              className="size-4 accent-primary"
              onChange={(event) =>
                updateField("allowAccessRequests", event.target.checked)
              }
              type="checkbox"
            />
            <span>Allow access requests</span>
          </label>

          <DialogFooter>
            <Button type="submit">Create Repository</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateRepositoryDialog
