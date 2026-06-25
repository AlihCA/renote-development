import { useParams } from "react-router"

import PagePlaceholder from "@/components/common/PagePlaceholder"

function RepositoryWorkspacePage() {
  const { repositoryId } = useParams()

  return (
    <PagePlaceholder
      description={`Workspace "${repositoryId}" will later support repository files, summaries, collections, and collaboration tools.`}
      eyebrow="Phase 3 route"
      title="Repository Workspace"
    />
  )
}

export default RepositoryWorkspacePage
