import {
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Link2,
  Presentation,
} from "lucide-react"

import { cn } from "@/lib/utils"

const sizeStyles = {
  sm: {
    container: "size-9 rounded-xl",
    icon: "size-4",
  },
  default: {
    container: "size-10 rounded-2xl",
    icon: "size-5",
  },
  lg: {
    container: "size-12 rounded-2xl",
    icon: "size-6",
  },
}

const fileTypeConfig = {
  default: {
    Icon: File,
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    label: "File",
  },
  document: {
    Icon: FileText,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300",
    label: "Document",
  },
  image: {
    Icon: FileImage,
    className:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-300",
    label: "Image",
  },
  link: {
    Icon: Link2,
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300",
    label: "Link",
  },
  pdf: {
    Icon: FileText,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
    label: "PDF",
  },
  presentation: {
    Icon: Presentation,
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300",
    label: "Presentation",
  },
  spreadsheet: {
    Icon: FileSpreadsheet,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
    label: "Spreadsheet",
  },
}

function normalizeFileType(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "")

  if (!normalized) {
    return "default"
  }

  if (normalized.includes("pdf")) {
    return "pdf"
  }

  if (
    ["doc", "docx"].includes(normalized) ||
    normalized.includes("word") ||
    normalized.includes("document")
  ) {
    return "document"
  }

  if (
    ["xls", "xlsx"].includes(normalized) ||
    normalized.includes("sheet") ||
    normalized.includes("excel")
  ) {
    return "spreadsheet"
  }

  if (
    ["ppt", "pptx"].includes(normalized) ||
    normalized.includes("presentation") ||
    normalized.includes("powerpoint")
  ) {
    return "presentation"
  }

  if (
    ["image", "png", "jpg", "jpeg"].includes(normalized) ||
    normalized.startsWith("image/")
  ) {
    return "image"
  }

  if (["link", "url"].includes(normalized) || normalized.startsWith("http")) {
    return "link"
  }

  return "default"
}

function FileTypeIcon({ className, extension, size = "default", type }) {
  const key = normalizeFileType(extension ?? type)
  const config = fileTypeConfig[key] ?? fileTypeConfig.default
  const Icon = config.Icon
  const sizeClass = sizeStyles[size] ?? sizeStyles.default

  return (
    <span
      aria-label={`${config.label} type`}
      className={cn(
        "inline-grid shrink-0 place-items-center border shadow-sm",
        sizeClass.container,
        config.className,
        className
      )}
      role="img"
    >
      <Icon aria-hidden="true" className={sizeClass.icon} />
    </span>
  )
}

export default FileTypeIcon
