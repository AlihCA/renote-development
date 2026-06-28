import { Link } from "react-router"
import {
  ArrowUpRight,
  Layers,
  Library,
  Plus,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import EmptyState from "@/components/common/EmptyState"
import PageShell from "@/components/common/PageShell"
import SectionCard from "@/components/common/SectionCard"
import DashboardCollectionCard from "@/components/dashboard/DashboardCollectionCard"
import DashboardRecentTabs from "@/components/dashboard/DashboardRecentTabs"
import { TrendingRepositoryRow } from "@/components/dashboard/DashboardRepositoryHighlights"
import DashboardStatCard from "@/components/dashboard/DashboardStatCard"
import DashboardWelcomeCard from "@/components/dashboard/DashboardWelcomeCard"
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  mockCollections,
  mockFiles,
  mockRecommendations,
  mockRepositories,
  mockSummaries,
} from "@/data"

function sortByDate(items, key) {
  return [...items].sort((first, second) => {
    return new Date(second[key]) - new Date(first[key])
  })
}

function toLabel(value) {
  return String(value ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function RecommendationCard({ item }) {
  return (
    <article className="rounded-lg border border-[#E9C8F2]/70 bg-white/85 p-4 transition-colors hover:border-primary/30 hover:bg-[#FFF8FE] dark:border-primary/20 dark:bg-background/40 dark:hover:border-primary/35 dark:hover:bg-primary/5">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-xl border-primary/15 bg-primary/10 text-primary shadow-none">
              {toLabel(item.type)}
            </Badge>
            <Badge className="rounded-xl" variant="outline">
              {item.similarityLabel}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">{item.title}</h3>
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {item.reason}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.relatedTags.slice(0, 3).map((tag) => (
              <Badge className="rounded-xl" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1" size="sm" variant="outline">
            <Link to={item.route}>
              Open
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() =>
              toast("Save recommendations will be connected during backend integration.")
            }
            size="sm"
            type="button"
            variant="outline"
          >
            <Star className="size-4" />
            Save
          </Button>
        </div>
      </div>
    </article>
  )
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
  const recommendedItems = mockRecommendations.slice(0, 3)

  function handleCreateRepository() {
    toast("Updated locally for this demo.")
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
        description="Prototype suggestions based on recent tags, saved materials, and summary activity."
        icon={Sparkles}
        title="Recommended for You"
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {recommendedItems.map((item) => (
            <RecommendationCard item={item} key={item.id} />
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
