import { Link } from "react-router"
import {
  ArrowUpRight,
  Layers,
  Library,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import DashboardCollectionCard from "@/components/dashboard/DashboardCollectionCard"
import DashboardRecentTabs from "@/components/dashboard/DashboardRecentTabs"
import {
  RecommendedRepositoryRow,
  TrendingRepositoryRow,
} from "@/components/dashboard/DashboardRepositoryHighlights"
import DashboardStatCard from "@/components/dashboard/DashboardStatCard"
import DashboardWelcomeCard from "@/components/dashboard/DashboardWelcomeCard"
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog"
import { Button } from "@/components/ui/button"
import {
  mockCollections,
  mockFiles,
  mockRepositories,
  mockSummaries,
} from "@/data"

const recommendationSeeds = [
  {
    reason: "Related to Capstone",
    repositoryId: "repo-web-development-references",
  },
  {
    reason: "Based on your saved resources",
    repositoryId: "repo-research-methods-notes",
  },
  {
    reason: "Popular in Cybersecurity",
    repositoryId: "repo-information-assurance-reviewer",
  },
]

function sortByDate(items, key) {
  return [...items].sort((first, second) => {
    return new Date(second[key]) - new Date(first[key])
  })
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
  const trendingRepositories = [...activeRepositories]
    .sort((first, second) => second.views - first.views)
    .slice(0, 3)
  const recommendedRepositories = recommendationSeeds
    .map((item) => ({
      reason: item.reason,
      repository: repositoryLookup.get(item.repositoryId),
    }))
    .filter((item) => item.repository)

  function handleCreateRepository() {
    toast("Repository created in prototype mode.")
  }

  return (
    <PageShell className="space-y-8">
      <DashboardWelcomeCard
        actions={
          <>
            <CreateRepositoryDialog
              onCreate={handleCreateRepository}
              trigger={
                <Button className="w-full justify-center border-white/20 bg-white text-primary shadow-sm hover:bg-white/90 sm:w-auto">
                  <Plus className="size-4" />
                  Create Repository
                </Button>
              }
            />
            <Button
              asChild
              className="w-full justify-center border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
              variant="outline"
            >
              <Link to="/app/explore">
                Explore Resources
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </>
        }
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

      <DashboardRecentTabs
        recentFiles={recentFiles}
        recentRepositories={recentRepositories}
        recentSummaries={recentSummaries}
        repositoryLookup={repositoryLookup}
      />

      <SectionCard
        description="Popular academic resources based on recent activity."
        icon={TrendingUp}
        title="Trending Repositories"
      >
        <div className="grid gap-3">
          {trendingRepositories.map((repository) => (
            <TrendingRepositoryRow
              key={repository.id}
              repository={repository}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        description="Suggested resources based on your recent workspace activity."
        icon={Sparkles}
        title="Recommended for You"
      >
        <div className="grid gap-3">
          {recommendedRepositories.map((item) => (
            <RecommendedRepositoryRow
              key={item.repository.id}
              reason={item.reason}
              repository={item.repository}
            />
          ))}
        </div>
      </SectionCard>

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
