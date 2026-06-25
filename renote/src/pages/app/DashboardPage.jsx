import { Link } from "react-router"
import {
  FileText,
  Layers,
  Library,
  Sparkles,
} from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import DashboardCollectionCard from "@/components/dashboard/DashboardCollectionCard"
import DashboardRecentCard from "@/components/dashboard/DashboardRecentCard"
import {
  RecentFileCompactRow,
  RecentRepositoryRow,
  RecentSummaryRow,
} from "@/components/dashboard/DashboardRecentRows"
import DashboardStatCard from "@/components/dashboard/DashboardStatCard"
import DashboardWelcomeCard from "@/components/dashboard/DashboardWelcomeCard"
import { Button } from "@/components/ui/button"
import {
  mockCollections,
  mockFiles,
  mockRepositories,
  mockSummaries,
} from "@/data"

function sortByDate(items, key) {
  return [...items].sort((first, second) => {
    return new Date(second[key]) - new Date(first[key])
  })
}

function getRepositoryTitle(repositoryLookup, repositoryId) {
  return repositoryLookup.get(repositoryId)?.title ?? "Unknown repository"
}

function DashboardPage() {
  const repositoryLookup = new Map(
    mockRepositories.map((repository) => [repository.id, repository])
  )
  const activeRepositories = mockRepositories.filter(
    (repository) => repository.status === "active"
  )

  const recentRepositories = sortByDate(activeRepositories, "updatedAt").slice(0, 3)
  const recentFiles = sortByDate(mockFiles, "updatedAt").slice(0, 3)
  const recentSummaries = sortByDate(mockSummaries, "generatedAt").slice(0, 3)
  const recentCollections = sortByDate(mockCollections, "updatedAt").slice(0, 3)

  return (
    <PageShell className="space-y-8">
      <DashboardWelcomeCard />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          description={`${activeRepositories.length} active academic spaces across your workspace.`}
          icon={Library}
          title="Total repositories"
          value={mockRepositories.length}
        />
        <DashboardStatCard
          description="Study boards and saved academic resource sets."
          icon={Layers}
          title="Collections"
          value={mockCollections.length}
        />
        <DashboardStatCard
          description="AI-assisted summary history for recent review workflows."
          icon={Sparkles}
          title="AI summaries"
          value={mockSummaries.length}
        />
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-3">
        <DashboardRecentCard
          icon={Library}
          title="Recent Repositories"
          to="/app/my-repositories"
        >
          {recentRepositories.length > 0 ? (
            <>
              {recentRepositories.map((repository) => (
                <RecentRepositoryRow
                  key={repository.id}
                  repository={repository}
                />
              ))}
            </>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Create or save a repository to see it here."
              icon={Library}
              title="No repositories yet"
            />
          )}
        </DashboardRecentCard>

        <DashboardRecentCard
          icon={FileText}
          title="Recent Files"
          to="/app/my-repositories"
        >
          {recentFiles.length > 0 ? (
            <>
              {recentFiles.map((file) => (
                <RecentFileCompactRow
                  file={file}
                  key={file.id}
                  repositoryTitle={getRepositoryTitle(
                    repositoryLookup,
                    file.repositoryId
                  )}
                />
              ))}
            </>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Recent files will appear after resources are added."
              icon={FileText}
              title="No files yet"
            />
          )}
        </DashboardRecentCard>

        <DashboardRecentCard
          icon={Sparkles}
          title="Recent Summaries"
          to="/app/summaries"
          viewAllLabel="View history"
        >
          {recentSummaries.length > 0 ? (
            <>
              {recentSummaries.map((summary) => (
                <RecentSummaryRow key={summary.id} summary={summary} />
              ))}
            </>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Generated summaries will appear here when available."
              icon={Sparkles}
              title="No summaries yet"
            />
          )}
        </DashboardRecentCard>
      </div>

      <SectionCard
        action={
          <Button asChild size="sm" variant="secondary">
            <Link to="/app/collections">View collections</Link>
          </Button>
        }
        description="Study boards and saved resource sets for focused review."
        icon={Layers}
        title="Collections Snapshot"
      >
        {recentCollections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentCollections.map((collection) => (
              <DashboardCollectionCard
                collection={collection}
                key={collection.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="min-h-44"
            description="Saved resources and study boards will appear here."
            icon={Layers}
            title="No collections yet"
          />
        )}
      </SectionCard>
    </PageShell>
  )
}

export default DashboardPage
