import { Link } from "react-router"
import {
  FileText,
  Layers,
  LayoutDashboard,
  Library,
  Plus,
  Search,
  Sparkles,
} from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import ActivitySnapshot from "@/components/dashboard/ActivitySnapshot"
import DashboardCollectionCard from "@/components/dashboard/DashboardCollectionCard"
import DashboardRepositoryCard from "@/components/dashboard/DashboardRepositoryCard"
import DashboardStatCard from "@/components/dashboard/DashboardStatCard"
import DashboardWelcomeCard from "@/components/dashboard/DashboardWelcomeCard"
import RecentFileRow from "@/components/dashboard/RecentFileRow"
import SummaryPreviewCard from "@/components/dashboard/SummaryPreviewCard"
import { Button } from "@/components/ui/button"
import {
  mockAccessRequests,
  mockCollections,
  mockFiles,
  mockNotifications,
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
  const latestNotification = sortByDate(mockNotifications, "createdAt")[0]
  const latestRequest = sortByDate(mockAccessRequests, "createdAt")[0]

  return (
    <PageShell className="space-y-8">
    
      <DashboardWelcomeCard />

      <PageHeader
        actions={
          <>
            <Button asChild>
              <Link to="/app/my-repositories">
                <Plus className="size-4" />
                Create Repository
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/explore">
                <Search className="size-4" />
                Explore Resources
              </Link>
            </Button>
          </>
        }
        description="A quick overview of your repositories, saved resources, summaries, and recent activity."
        eyebrow="Workspace"
        icon={LayoutDashboard}
        title="Dashboard"
      />

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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <SectionCard
          action={
            <Button asChild size="sm" variant="secondary">
              <Link to="/app/my-repositories">View all</Link>
            </Button>
          }
          description="Recently updated spaces across public, restricted, and private academic materials."
          icon={Library}
          title="Recent Repositories"
        >
          {recentRepositories.length > 0 ? (
            <div className="space-y-3">
              {recentRepositories.map((repository) => (
                <DashboardRepositoryCard
                  key={repository.id}
                  repository={repository}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Create or save a repository to see it here."
              icon={Library}
              title="No repositories yet"
            />
          )}
        </SectionCard>

        <ActivitySnapshot
          latestNotification={latestNotification}
          latestRequest={latestRequest}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <SectionCard
          description="Latest uploaded or updated materials across mock repositories."
          icon={FileText}
          title="Recent Files"
        >
          {recentFiles.length > 0 ? (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <RecentFileRow
                  file={file}
                  key={file.id}
                  repositoryTitle={getRepositoryTitle(
                    repositoryLookup,
                    file.repositoryId
                  )}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Recent files will appear after resources are added."
              icon={FileText}
              title="No files yet"
            />
          )}
        </SectionCard>

        <SectionCard
          action={
            <Button asChild size="sm" variant="secondary">
              <Link to="/app/summaries">View history</Link>
            </Button>
          }
          description="AI-assisted summary history from recent academic materials."
          icon={Sparkles}
          title="AI Summary Preview"
          variant="glow"
        >
          {recentSummaries.length > 0 ? (
            <div className="space-y-3">
              {recentSummaries.map((summary) => (
                <SummaryPreviewCard key={summary.id} summary={summary} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="min-h-44"
              description="Generated summaries will appear here when available."
              icon={Sparkles}
              title="No summaries yet"
            />
          )}
        </SectionCard>
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
