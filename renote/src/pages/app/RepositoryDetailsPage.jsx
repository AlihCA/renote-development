import { useParams } from "react-router"

import PagePlaceholder from "@/components/common/PagePlaceholder"

function RepositoryDetailsPage() {
  const { repositoryId } = useParams()

  return (
    <PagePlaceholder
      description={`Repository "${repositoryId}" will later show files, access controls, summaries, and previews.`}
      title="Repository Details"
    />
  )
}

export default RepositoryDetailsPage
