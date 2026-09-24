import { Link, useSearchParams } from "react-router"
import { ArrowUpRight, BookOpen, Search } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockRepositories } from "@/data"
import { APP_ROLES } from "@/lib/roles"

function MyRepositoriesPage({
  description = "Browse sample faculty course spaces. Membership and course management will be connected later.",
  emptyTitle = "No courses found",
  openLabel = "Open course",
  title = "My Courses",
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const normalizedQuery = query.trim().toLowerCase()
  const materials = mockRepositories.filter((repository) => {
    if (repository.ownerRole !== APP_ROLES.FACULTY || repository.status !== "active") {
      return false
    }

    return (
      !normalizedQuery ||
      [repository.title, repository.subject, repository.description]
        .some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery))
    )
  })

  function updateQuery(value) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (value.trim()) {
      nextSearchParams.set("q", value)
    } else {
      nextSearchParams.delete("q")
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description={description}
        title={title}
      />

      <label className="relative block max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <span className="sr-only">Search materials</span>
        <Input
          className="h-10 pl-9"
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search by title or subject"
          type="search"
          value={query}
        />
      </label>

      {materials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((repository) => (
            <article className="renote-card flex flex-col gap-4 p-5" key={repository.id}>
              <div className="flex items-start gap-3">
                <span className="renote-icon-container">
                  <BookOpen className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold">{repository.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{repository.subject}</p>
                </div>
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {repository.description}
              </p>
              <Button asChild className="mt-auto w-fit" size="sm" variant="outline">
                <Link to={`/app/workspace/${repository.id}`}>
                  {openLabel}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try a different title or subject."
          icon={Search}
          title={emptyTitle}
        />
      )}
    </PageShell>
  )
}

export default MyRepositoriesPage
