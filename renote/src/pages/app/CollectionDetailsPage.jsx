import { useParams } from "react-router"

import PagePlaceholder from "@/components/common/PagePlaceholder"

function CollectionDetailsPage() {
  const { collectionId } = useParams()

  return (
    <PagePlaceholder
      description={`Collection "${collectionId}" will later show grouped repositories, files, members, and review progress.`}
      eyebrow="Phase 3 route"
      title="Collection Details"
    />
  )
}

export default CollectionDetailsPage
