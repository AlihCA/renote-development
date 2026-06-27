import { useState } from "react"
import { Check, Eye, Lock, Plus, Users, X } from "lucide-react"

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
import { cn } from "@/lib/utils"

const initialForm = {
  allowAccessRequests: true,
  category: "",
  description: "",
  tags: [],
  title: "",
  visibility: "restricted",
}

const visibilityOptions = [
  {
    description: "Anyone can view this repository.",
    Icon: Eye,
    label: "Public",
    value: "public",
  },
  {
    description: "Users can preview it and request access.",
    Icon: Users,
    label: "Restricted",
    value: "restricted",
  },
  {
    description: "Only you and invited users can access it.",
    Icon: Lock,
    label: "Private",
    value: "private",
  },
]
const categoryOptions = [
  "Research / Thesis",
  "Courses",
  "Reviewers",
  "Templates",
  "Lecture Materials",
  "References",
  "Projects",
  "Policies / Guidelines",
  "General Notes",
]

function normalizeTag(value) {
  return value.trim().replace(/\s+/g, " ")
}

function getTagList(tags, draft) {
  const values = [...tags, normalizeTag(draft)].filter(Boolean)

  return values.filter((tag, index) => {
    const key = tag.toLowerCase()
    return values.findIndex((item) => item.toLowerCase() === key) === index
  })
}

function VisibilityOptionCard({ Icon, description, isSelected, label, onSelect }) {
  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "flex h-full rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25",
        isSelected
          ? "border-primary/45 bg-primary/10 text-foreground"
          : "border-[#E9C8F2]/80 bg-white/80 hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/60 dark:hover:bg-primary/5"
      )}
      onClick={onSelect}
      type="button"
    >
      <span
        className={cn(
          "mr-3 grid size-10 shrink-0 place-items-center rounded-2xl border",
          isSelected
            ? "border-primary/20 bg-white text-primary dark:bg-background/80"
            : "border-[#E9C8F2]/70 bg-[#FCF7FF] text-primary/80 dark:border-primary/20 dark:bg-primary/5"
        )}
      >
        <Icon className="size-4" />
      </span>

      <span className="min-w-0 flex-1 space-y-1">
        <span className="block font-semibold">{label}</span>
        <span className="block text-sm leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={cn(
          "ml-3 grid size-5 shrink-0 place-items-center rounded-full border",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-[#E9C8F2] bg-white dark:border-primary/20 dark:bg-background"
        )}
      >
        {isSelected ? <Check className="size-3" /> : null}
      </span>
    </button>
  )
}

function CreateRepositoryDialog({ onCreate }) {
  const [form, setForm] = useState(initialForm)
  const [isOpen, setIsOpen] = useState(false)
  const [tagDraft, setTagDraft] = useState("")

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
      category: form.category || "General Notes",
      title: form.title.trim(),
      description: form.description.trim(),
      tags: getTagList(form.tags, tagDraft),
    })

    setForm(initialForm)
    setTagDraft("")
    setIsOpen(false)
  }

  function handleAddTag() {
    const nextTag = normalizeTag(tagDraft)

    if (!nextTag) {
      return
    }

    setForm((currentForm) => ({
      ...currentForm,
      tags: getTagList(currentForm.tags, nextTag),
    }))
    setTagDraft("")
  }

  function handleTagKeyDown(event) {
    if (event.key !== "Enter") {
      return
    }

    event.preventDefault()
    handleAddTag()
  }

  function handleRemoveTag(tagToRemove) {
    setForm((currentForm) => ({
      ...currentForm,
      tags: currentForm.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-[#E9C8F2]/80 bg-white p-6 shadow-xl dark:border-primary/20 dark:bg-popover sm:max-w-2xl sm:p-7 lg:max-w-3xl">
        <DialogHeader className="gap-2 pr-10">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create Repository
          </DialogTitle>
          <DialogDescription>
            Add a prototype repository to your local ReNote workspace preview.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">
              Repository title
            </span>
            <Input
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Software Engineering Reviewer"
              required
              value={form.title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">
              Description
            </span>
            <textarea
              className="min-h-28 w-full resize-none rounded-2xl border border-[#E9C8F2]/80 bg-background/80 px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary/45 focus-visible:ring-3 focus-visible:ring-primary/20 dark:border-primary/20"
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the academic materials in this repository."
              value={form.description}
            />
          </label>

          <section className="space-y-3">
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="repository-category"
              >
                Category
              </label>
              <p className="text-sm text-muted-foreground">
                Choose the main academic category for this repository.
              </p>
            </div>

            <Select
              onValueChange={(value) => updateField("category", value)}
              value={form.category}
            >
              <SelectTrigger
                className="h-10 w-full border-[#E9C8F2]/80 bg-background/80"
                id="repository-category"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Choose who can discover or access this repository.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {visibilityOptions.map((option) => (
                <VisibilityOptionCard
                  {...option}
                  isSelected={form.visibility === option.value}
                  key={option.value}
                  onSelect={() => updateField("visibility", option.value)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="repository-tag"
              >
                Tags
              </label>
              <p className="text-sm text-muted-foreground">
                Add tags to organize and find this repository easily.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="repository-tag"
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag"
                value={tagDraft}
              />
              <Button
                className="w-full sm:w-auto"
                onClick={handleAddTag}
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add Tag
              </Button>
            </div>

            {form.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E9C8F2] bg-[#FCF7FF] px-3 py-1 text-xs font-medium text-muted-foreground dark:border-primary/20 dark:bg-primary/5"
                    key={tag}
                  >
                    {tag}
                    <button
                      aria-label={`Remove ${tag}`}
                      className="rounded-full text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <label className="flex items-start gap-3 rounded-2xl border border-[#E9C8F2]/80 bg-background/60 p-4 text-sm dark:border-primary/20">
            <input
              checked={form.allowAccessRequests}
              className="mt-0.5 size-4 shrink-0 accent-primary"
              onChange={(event) =>
                updateField("allowAccessRequests", event.target.checked)
              }
              type="checkbox"
            />
            <span className="space-y-1">
              <span className="block font-medium text-foreground">
                Allow access requests
              </span>
              <span className="block leading-5 text-muted-foreground">
                Let users request access to restricted or private repositories.
              </span>
            </span>
          </label>

          <DialogFooter className="border-t border-[#E9C8F2]/70 pt-5 dark:border-border">
            <DialogClose asChild>
              <Button className="w-full sm:w-auto" type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full sm:w-auto" type="submit">
              Create Repository
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateRepositoryDialog
