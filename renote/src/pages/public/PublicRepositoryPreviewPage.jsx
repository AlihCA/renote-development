import { Link, useParams } from "react-router"
import { FileQuestion, LockKeyhole } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import RepositoryPreview from "@/components/repositories/RepositoryPreview"
import { Button } from "@/components/ui/button"
import { mockRepositories } from "@/data"

function PublicRepositoryPreviewPage() {
  const { repositoryId } = useParams()
  const repository = mockRepositories.find((item) => item.id === repositoryId)

  if (!repository) {
    return (
      <PageShell>
        <EmptyState
          action={
            <Button asChild>
              <Link to="/explore-public">Back to Explore</Link>
            </Button>
          }
          description="This public repository preview could not be found."
          icon={FileQuestion}
          title="Repository not found"
        />
      </PageShell>
    )
  }

  if (repository.visibility !== "public") {
    return (
      <PageShell className="pt-10 sm:pt-12">
        <EmptyState
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to="/sign-in">Sign in to request access</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/explore-public">Back to Explore</Link>
              </Button>
            </div>
          }
          description="This repository is restricted in the prototype preview. Sign in or request access before viewing its files and summaries."
          icon={LockKeyhole}
          title="Restricted repository"
        />
      </PageShell>
    )
  }

  return (
    <PageShell className="space-y-6 pt-10 sm:pt-12" size="wide">
      <RepositoryPreview
        backHref="/explore-public"
        backLabel="Back to Explore"
        mode="public"
        repository={repository}
      />
    </PageShell>
  )
}

export default PublicRepositoryPreviewPage
