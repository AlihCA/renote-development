import { useState } from "react"
import { useSearchParams } from "react-router"
import { FileText, Search } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import ResourceCard from "@/components/course/ResourceCard"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { selectCoursesForUser, selectFacultyMaterials } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function FacultyMaterialsPage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [courseId, setCourseId] = useState("all")
  const [topicId, setTopicId] = useState("all")
  const [publicationStatus, setPublicationStatus] = useState("all")
  const [resourceType, setResourceType] = useState("all")
  const query = searchParams.get("q") ?? ""
  const ownedCourses = selectCoursesForUser(state, appUser)
  const ownedCourseIds = new Set(ownedCourses.map((course) => course.id))
  const availableTopics = state.topics.filter((topic) =>
    ownedCourseIds.has(topic.courseId) && (courseId === "all" || topic.courseId === courseId)
  )
  const coursesById = new Map(ownedCourses.map((course) => [course.id, course]))
  const topicsById = new Map(state.topics.map((topic) => [topic.id, topic]))
  const resources = selectFacultyMaterials(state, appUser, {
    query,
    courseId: courseId === "all" ? null : courseId,
    topicId: topicId === "all" ? null : topicId,
    publicationStatus: publicationStatus === "all" ? null : publicationStatus,
    resourceType: resourceType === "all" ? null : resourceType,
  })

  function updateQuery(value) {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set("q", value)
    else next.delete("q")
    setSearchParams(next, { replace: true })
  }

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Resources in courses assigned to your Faculty prototype account. Draft and Published are separate from processing status."
        icon={FileText}
        title="Materials"
      />

      <div className="renote-card grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-1.5 sm:col-span-2 xl:col-span-1">
          <span className="text-xs font-medium text-muted-foreground">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" onChange={(event) => updateQuery(event.target.value)} placeholder="Title or file type" type="search" value={query} />
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Course</span>
          <Select onValueChange={(value) => { setCourseId(value); setTopicId("all") }} value={courseId}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {ownedCourses.map((course) => <SelectItem key={course.id} value={course.id}>{course.courseCode}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Topic / Week</span>
          <Select onValueChange={setTopicId} value={topicId}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {availableTopics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {coursesById.get(topic.courseId)?.courseCode} · {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Publication</span>
          <Select onValueChange={setPublicationStatus} value={publicationStatus}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Resource type</span>
          <Select onValueChange={setResourceType} value={resourceType}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Files and links</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="link">Links</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      {resources.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard
              course={coursesById.get(resource.courseId)}
              key={resource.id}
              resource={resource}
              showStatus
              topic={topicsById.get(resource.topicId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState description="Try another course, topic, publication state, or resource type." icon={FileText} title="No materials found" />
      )}
    </PageShell>
  )
}

export default FacultyMaterialsPage
