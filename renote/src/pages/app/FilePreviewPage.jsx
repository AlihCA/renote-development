import { useParams } from "react-router"

import PagePlaceholder from "@/components/common/PagePlaceholder"

function FilePreviewPage() {
  const { fileId } = useParams()

  return (
    <PagePlaceholder
      description={`File "${fileId}" will later show previews, metadata, download actions, and summary entry points.`}
      eyebrow="Phase 3 route"
      title="File Preview"
    />
  )
}

export default FilePreviewPage
