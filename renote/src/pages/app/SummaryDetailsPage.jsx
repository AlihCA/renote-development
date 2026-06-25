import { useParams } from "react-router"

import PagePlaceholder from "@/components/common/PagePlaceholder"

function SummaryDetailsPage() {
  const { summaryId } = useParams()

  return (
    <PagePlaceholder
      description={`Summary "${summaryId}" will later show generated notes, source references, and review actions.`}
      eyebrow="Phase 3 route"
      title="Summary Details"
    />
  )
}

export default SummaryDetailsPage
