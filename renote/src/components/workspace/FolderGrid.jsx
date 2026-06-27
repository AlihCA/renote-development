import { FileText, Folder, FolderOpen } from "lucide-react"

import { cn } from "@/lib/utils"

function FolderGrid({ files, folders, onSelectFolder, selectedFolderId }) {
  function getFileCount(folderId) {
    return files.filter((file) => file.folderId === folderId).length
  }

  const folderOptions = [
    {
      count: files.length,
      depth: 0,
      id: "all",
      name: "All Files",
      type: "all",
    },
    ...folders.map((folder) => ({
      ...folder,
      count: getFileCount(folder.id),
      type: "folder",
    })),
  ]

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight">Folders</h2>
          <p className="text-sm text-muted-foreground">
            Choose a folder to narrow the file list.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {folders.length} folders
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {folderOptions.map((folder) => {
          const isActive = selectedFolderId === folder.id
          const Icon =
            folder.type === "all" ? FileText : isActive ? FolderOpen : Folder

          return (
            <button
              className={cn(
                "group flex min-w-0 items-center gap-3 rounded-3xl border bg-background/80 p-3 text-left shadow-sm transition hover:border-primary/20 hover:bg-[#FFF7FD] dark:hover:bg-primary/5",
                isActive &&
                  "border-primary/40 bg-primary/10 text-primary shadow-none"
              )}
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              type="button"
            >
              <span
                className={cn(
                  "inline-grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-muted text-muted-foreground transition",
                  isActive &&
                    "border-primary/20 bg-primary text-primary-foreground"
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm font-semibold">
                  {"- ".repeat(folder.depth)}
                  {folder.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {folder.count} item{folder.count === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default FolderGrid
