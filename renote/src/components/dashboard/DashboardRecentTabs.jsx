import { Clock3, FileText, Library, Sparkles } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import SectionCard from "@/components/common/SectionCard"
import {
  RecentFileCompactRow,
  RecentRepositoryRow,
  RecentSummaryRow,
} from "@/components/dashboard/DashboardRecentRows"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function DashboardRecentTabs({
  recentFiles,
  recentRepositories,
  recentSummaries,
  repositoryLookup,
}) {
  return (
    <SectionCard
      className="overflow-hidden"
      description="Recent workspace activity grouped into one calmer view."
      icon={Clock3}
      title="Recents"
    >
      <Tabs className="w-full" defaultValue="repositories">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-[#F7ECFB] p-1 dark:bg-primary/10 sm:w-fit">
          <TabsTrigger
            className="min-w-0 px-2 text-xs sm:px-4 sm:text-sm"
            value="repositories"
          >
            Repositories
          </TabsTrigger>
          <TabsTrigger
            className="min-w-0 px-2 text-xs sm:px-4 sm:text-sm"
            value="files"
          >
            Files
          </TabsTrigger>
          <TabsTrigger
            className="min-w-0 px-2 text-xs sm:px-4 sm:text-sm"
            value="summaries"
          >
            Summaries
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4" value="repositories">
          {recentRepositories.length > 0 ? (
            <div className="grid gap-3">
              {recentRepositories.map((repository) => (
                <RecentRepositoryRow
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
        </TabsContent>

        <TabsContent className="mt-4" value="files">
          {recentFiles.length > 0 ? (
            <div className="grid gap-3">
              {recentFiles.map((file) => (
                <RecentFileCompactRow
                  file={file}
                  key={file.id}
                  repositoryTitle={
                    repositoryLookup.get(file.repositoryId)?.title ??
                    "Unknown repository"
                  }
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
        </TabsContent>

        <TabsContent className="mt-4" value="summaries">
          {recentSummaries.length > 0 ? (
            <div className="grid gap-3">
              {recentSummaries.map((summary) => (
                <RecentSummaryRow key={summary.id} summary={summary} />
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
        </TabsContent>
      </Tabs>
    </SectionCard>
  )
}

export default DashboardRecentTabs
