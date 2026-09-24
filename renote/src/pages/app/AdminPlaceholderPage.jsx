import { Bot, ChartNoAxesCombined, FileText, Users } from "lucide-react"

import EmptyState from "@/components/common/EmptyState"
import PageHeader from "@/components/common/PageHeader"
import PageShell from "@/components/common/PageShell"

const pageContent = {
  users: {
    title: "User Management",
    description: "Manage ReNote user accounts, roles, and account status.",
    placeholder: "User account management will be implemented in the upcoming workflow step.",
    icon: Users,
  },
  content: {
    title: "Content Moderation",
    description: "Review and manage academic content across ReNote.",
    placeholder: "Content moderation will be implemented in the upcoming workflow step.",
    icon: FileText,
  },
  usage: {
    title: "Platform Usage",
    description: "Review activity and usage across the platform.",
    placeholder: "Platform usage reporting will be implemented in the upcoming workflow step.",
    icon: ChartNoAxesCombined,
  },
  aiUsage: {
    title: "AI Usage",
    description: "Monitor AI requests, usage limits, and estimated costs.",
    placeholder: "AI usage monitoring will be implemented in the upcoming workflow step.",
    icon: Bot,
  },
}

function AdminPlaceholderPage({ page }) {
  const content = pageContent[page]

  return (
    <PageShell className="space-y-7">
      <PageHeader description={content.description} icon={content.icon} title={content.title} />
      <EmptyState description={content.placeholder} icon={content.icon} title="Coming in the next step" />
    </PageShell>
  )
}

export default AdminPlaceholderPage
