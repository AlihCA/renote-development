import { Link } from "react-router"
import { Bell, FileText } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"
import { selectStudentNotifications } from "@/data/prototypeDomain"
import useApplicationUser from "@/hooks/useApplicationUser"
import usePrototypeData from "@/hooks/usePrototypeData"

function StudentNotificationsPage() {
  const { appUser } = useApplicationUser()
  const { state } = usePrototypeData()
  const notifications = selectStudentNotifications(state, appUser)

  return (
    <PageShell className="space-y-7">
      <PageHeader
        description="Prototype notices for published materials in your joined courses. Event delivery comes later."
        icon={Bell}
        title="Notifications"
      />
      {notifications.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const course = state.courses.find((item) => item.id === notification.courseId)
            return (
              <Link className="renote-card flex items-start gap-3 p-4 hover:border-primary/30 hover:bg-accent/50" key={notification.id} to={`/app/files/${notification.resourceId}`}>
                <span className="renote-icon-container"><FileText className="size-5" /></span>
                <span>
                  <span className="block font-medium">{notification.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{course?.courseCode} · {new Date(notification.createdAt).toLocaleDateString()}</span>
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState description="New material notices from joined courses will appear here." icon={Bell} title="No notifications" />
      )}
    </PageShell>
  )
}

export default StudentNotificationsPage
