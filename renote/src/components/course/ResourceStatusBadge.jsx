import { Badge } from "@/components/ui/badge"
import { PROCESSING_STATUS, PUBLICATION_STATUS } from "@/data/prototypeDomain"

export function PublicationBadge({ status }) {
  const isPublished = status === PUBLICATION_STATUS.PUBLISHED

  return (
    <Badge
      className={isPublished
        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"}
      variant="outline"
    >
      {isPublished ? "Published" : "Draft"}
    </Badge>
  )
}

export function ProcessingBadge({ status }) {
  const styles = {
    [PROCESSING_STATUS.PENDING]: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
    [PROCESSING_STATUS.PROCESSING]: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
    [PROCESSING_STATUS.READY]: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    [PROCESSING_STATUS.FAILED]: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  }

  return (
    <Badge className={styles[status]} variant="outline">
      Processing: {status}
    </Badge>
  )
}
